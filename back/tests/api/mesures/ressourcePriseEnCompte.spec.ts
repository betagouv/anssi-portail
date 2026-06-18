import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { MesurePriseEnCompte } from '../../../src/bus/evenements/mesurePriseEnCompte';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire';
import { EntrepotPriseEnCompteMemoire } from '../../persistance/EntrepotPriseEnCompteMemoire';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire';
import { encodeSession } from '../cookie';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { mesureAuthentA2Etapes } from '../objetsPretsALEmploi';
import { mesureDeTest } from './constructeurDeMesure';
import { Utilisateur } from '../../../src/metier/utilisateur';
import { utilisateurDeTest } from './constructeurDUtilisateur';

describe("La ressource de prise en compte d'une mesure", () => {
  let serveur: Express;
  let entrepotPriseEnCompte: EntrepotPriseEnCompteMemoire;
  let entrepotMesure: EntrepotMesureMemoire;
  let entrepotUtilisateur: EntrepotUtilisateur;
  let busEvenements: MockBusEvenement;
  let utilisateurParcours: Utilisateur;
  let cookie: string;

  beforeEach(() => {
    entrepotPriseEnCompte = new EntrepotPriseEnCompteMemoire();
    entrepotMesure = new EntrepotMesureMemoire();
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();
    busEvenements = fabriqueBusPourLesTests();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotPriseEnCompte,
      entrepotMesure,
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

      const putPriseEnCompteConnecte = () =>
        request(serveur).put('/api/mesures/AUTH.5/prise-en-compte').set('Cookie', cookie);

      beforeEach(async () => {
        await entrepotMesure.ajoute(mesure);
        await entrepotUtilisateur.ajoute(utilisateurParcours);
      });

      it('réponds 201', async () => {
        const reponse = await putPriseEnCompteConnecte();

        assert.equal(reponse.status, 201);
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
        await entrepotMesure.ajoute(mesureDeTest().avecLId('AUTH.1').avecLOrdre(1).construis());
        await entrepotMesure.ajoute(mesureDeTest().avecLId('AUTH.20').avecLOrdre(20).construis());

        await putPriseEnCompteConnecte();

        busEvenements.aRecuUnEvenement(MesurePriseEnCompte);
        const evenement = busEvenements.recupereEvenement(MesurePriseEnCompte);
        assert.equal(evenement!.idMesure, 'AUTH.5');
        assert.equal(evenement!.emailHache, 'utilisateur@mail.com-hache');
        assert.equal(evenement!.nombreDeMesures, 3);
        assert.equal(evenement!.position, 2);
      });
    });
  });
});
