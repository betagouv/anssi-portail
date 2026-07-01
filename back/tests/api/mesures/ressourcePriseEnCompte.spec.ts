import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { MesurePriseEnCompte } from '../../../src/bus/evenements/mesurePriseEnCompte.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { Module } from '../../../src/metier/module.js';
import { Utilisateur } from '../../../src/metier/utilisateur.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire.js';
import { EntrepotPriseEnCompteMemoire } from '../../persistance/EntrepotPriseEnCompteMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { mesureAuthentA2Etapes } from '../objetsPretsALEmploi.js';
import { mesureDeTest } from './constructeurDeMesure.js';
import { utilisateurDeTest } from './constructeurDUtilisateur.js';

describe("La ressource de prise en compte d'une mesure", () => {
  let serveur: Express;
  let entrepotPriseEnCompte: EntrepotPriseEnCompteMemoire;
  let entrepotMesure: EntrepotMesureMemoire;
  let entrepôtModule: EntrepôtModuleMémoire;
  let entrepotUtilisateur: EntrepotUtilisateur;
  let busEvenements: MockBusEvenement;
  let utilisateurParcours: Utilisateur;
  let cookie: string;

  beforeEach(() => {
    entrepotPriseEnCompte = new EntrepotPriseEnCompteMemoire();
    entrepotMesure = new EntrepotMesureMemoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    entrepôtModule = new EntrepôtModuleMémoire();
    busEvenements = fabriqueBusPourLesTests();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotPriseEnCompte,
      entrepotMesure,
      entrepôtModule,
      entrepotUtilisateur,
      busEvenements,
    });
    utilisateurParcours = utilisateurDeTest().avecLEmail('utilisateur@mail.com').construis();
    cookie = encodeSession({ email: utilisateurParcours.email, token: 'valide' });
  });

  describe('sur une requête PUT', () => {
    describe("d'un utilisateur anonyme", () => {
      it('réponds 401', async () => {
        const reponse = await request(serveur).put('/api/mesures/AUTH.5/prise-en-compte');

        assert.equal(reponse.status, 401);
      });
    });

    describe("d'un utilisateur connecté", () => {
      const mesure = mesureAuthentA2Etapes();
      let module: Module;

      const putPriseEnCompteConnecte = () =>
        request(serveur).put('/api/mesures/AUTH.5/prise-en-compte').set('Cookie', cookie);

      beforeEach(async () => {
        module = new Module(1, 'Cyberdépart');
        module.mesures = [mesure];
        await entrepotMesure.ajoute(mesure);
        await entrepôtModule.ajoute(module);
        await entrepotUtilisateur.ajoute(utilisateurParcours);
      });

      it('réponds 201', async () => {
        const reponse = await putPriseEnCompteConnecte();

        assert.equal(reponse.status, 201);
      });

      it('renvoie le nouvel état du module', async () => {
        const { body } = await putPriseEnCompteConnecte();

        assert.equal(body.badgeCyberdépartDebloqué, false);
        assert.equal(body.moduleTerminé, true);
      });

      it('ajoute une prise en compte', async () => {
        await putPriseEnCompteConnecte();

        const priseEnComptePersistee = await entrepotPriseEnCompte.pour(utilisateurParcours, mesure);
        assert.notEqual(priseEnComptePersistee, undefined);
      });

      it("réponds 404 si la mesure n'existe pas", async () => {
        const reponse = await request(serveur).put('/api/mesures/mesureinconnue/prise-en-compte').set('Cookie', cookie);

        assert.equal(reponse.status, 404);
      });

      it('publie un événement de prise en compte', async () => {
        const mesureAuth1 = mesureDeTest().avecLId('AUTH.1').avecLOrdre(1).construis();
        const mesureAuth20 = mesureDeTest().avecLId('AUTH.20').avecLOrdre(20).construis();
        await entrepotMesure.ajoute(mesureAuth1);
        await entrepotMesure.ajoute(mesureAuth20);
        module.mesures.push(mesureAuth1, mesureAuth20);

        await putPriseEnCompteConnecte();

        busEvenements.aRecuUnEvenement(MesurePriseEnCompte);
        const evenement = busEvenements.recupereEvenement(MesurePriseEnCompte);
        assert.equal(evenement!.idMesure, 'AUTH.5');
        assert.equal(evenement!.emailHache, 'utilisateur@mail.com-hache');
        assert.equal(evenement!.nombreDeMesures, 3);
        assert.equal(evenement!.position, 2);
      });

      it('ne compte pas les mesures des autres modules dans l’événement', async () => {
        const nouveuModule = new Module(2, 'Nouveau module');
        const nouvelleMesure = mesureDeTest().construis();
        await entrepôtModule.ajoute(nouveuModule);
        await entrepotMesure.ajoute(nouvelleMesure);

        await putPriseEnCompteConnecte();

        const evenement = busEvenements.recupereEvenement(MesurePriseEnCompte);
        assert.equal(evenement!.nombreDeMesures, 1);
      });
    });
  });
});
