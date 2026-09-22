import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { MesurePriseEnCompte } from '../../../src/bus/evenements/mesurePriseEnCompte.js';
import { EntrepotUtilisateur } from '../../../src/metier/entrepotUtilisateur.js';
import { Module } from '../../../src/metier/module.js';
import { Parcours } from '../../../src/metier/parcours.js';
import { Utilisateur } from '../../../src/metier/utilisateur.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../../bus/busPourLesTests.js';
import { EntrepotMesureMemoire } from '../../persistance/entrepotMesureMemoire.js';
import { EntrepôtModuleMémoire } from '../../persistance/EntrepôtModuleMémoire.js';
import { EntrepotPriseEnCompteMemoire } from '../../persistance/EntrepotPriseEnCompteMemoire.js';
import { EntrepotUtilisateurMemoire } from '../../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from '../cookie.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';
import { mesureAuthentA2Etapes } from '../objetsPretsALEmploi.js';
import { mesureDeTest } from './constructeurDeMesure.js';
import { ConstructeurDeModule } from './constructeurDeModule.js';
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
    utilisateurParcours = utilisateurDeTest().avecLEmail('utilisateur@mail.com').avecLeParcours('allégé').construis();
    cookie = encodeSession({ email: utilisateurParcours.email, token: 'valide' });
  });

  describe('sur une requête PUT', () => {
    describe("d'un utilisateur anonyme", () => {
      it('réponds 401', async () => {
        const reponse = await request(serveur).put('/api/mesures/AUTH.5/prise-en-compte');

        expect(reponse.status).toBe(HttpStatusCode.Unauthorized);
      });
    });

    describe("d'un utilisateur connecté", () => {
      const mesure = mesureAuthentA2Etapes();
      let module: Module;

      const putPriseEnCompteConnecte = () =>
        request(serveur).put('/api/mesures/AUTH.5/prise-en-compte').set('Cookie', cookie);

      beforeEach(async () => {
        module = new ConstructeurDeModule().construis();
        module.mesures = [mesure];
        await entrepotMesure.ajoute(mesure);
        await entrepôtModule.ajoute(module);
        await entrepotUtilisateur.ajoute(utilisateurParcours);
      });

      it('réponds 201', async () => {
        const reponse = await putPriseEnCompteConnecte();

        expect(reponse.status).toBe(HttpStatusCode.Created);
      });

      it('renvoie le nouvel état du module', async () => {
        const { body } = await putPriseEnCompteConnecte();

        expect(body.badgeCyberdépartDebloqué).toBe(false);
        expect(body.moduleTerminé).toBe(true);
        expect(body.parcoursCompletTerminé).toBe(true);
      });

      it('ajoute une prise en compte', async () => {
        await putPriseEnCompteConnecte();

        const priseEnComptePersistee = await entrepotPriseEnCompte.pour(utilisateurParcours, mesure);
        expect(priseEnComptePersistee).toBeDefined();
      });

      it("réponds 404 si la mesure n'existe pas", async () => {
        const reponse = await request(serveur).put('/api/mesures/mesureinconnue/prise-en-compte').set('Cookie', cookie);

        expect(reponse.status).toBe(HttpStatusCode.NotFound);
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
        expect(evenement!.idMesure).toBe('AUTH.5');
        expect(evenement!.email).toBe('utilisateur@mail.com');
        expect(evenement!.nombreDeMesures).toBe(3);
        expect(evenement!.position).toBe(2);
        expect(evenement?.parcours).toBe('allégé');
      });

      it('ne compte pas les mesures des autres modules dans l’événement', async () => {
        const nouveauModule = new ConstructeurDeModule().avecLId(2).avecLeNom('Nouveau module').construis();
        const nouvelleMesure = mesureDeTest().construis();
        await entrepôtModule.ajoute(nouveauModule);
        await entrepotMesure.ajoute(nouvelleMesure);

        await putPriseEnCompteConnecte();

        const evenement = busEvenements.recupereEvenement(MesurePriseEnCompte);
        expect(evenement!.nombreDeMesures).toBe(1);
      });

      it("mets à jour le parcours de l'utilisateur", async () => {
        let nouveauParcours: Parcours | null | undefined = null;
        entrepotUtilisateur.metsAJour = async (utilisateur: Utilisateur) => {
          nouveauParcours = utilisateur.parcoursActuel();
        };
        await request(serveur).put('/api/mesures/AUTH.5/prise-en-compte').set('Cookie', cookie);

        expect(nouveauParcours).toBe('complet');
      });
    });
  });
});
