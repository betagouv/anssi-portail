import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { attributionParcours } from '../../src/api/middlewares/attributionParcours.js';
import { creeServeur } from '../../src/api/msc.js';
import { MesureConsultee } from '../../src/bus/evenements/mesureConsultee.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../bus/busPourLesTests.js';
import { EntrepotMesureMemoire } from '../persistance/entrepotMesureMemoire.js';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire.js';
import { EntrepôtModuleMémoire } from '../persistance/EntrepôtModuleMémoire.js';
import { encodeSession } from './cookie.js';
import { configurationDeTestDuServeur, fauxGestionnaireRequêtesComplémentaires, fauxMiddleware } from './fauxObjets.js';
import { mesureDeTest } from './mesures/constructeurDeMesure.js';
import { ConstructeurDUtilisateur } from './mesures/constructeurDUtilisateur.js';
import { fabriqueModuleCyberdépart, jeanneDupont } from './objetsPretsALEmploi.js';

describe("La ressource d'une page Jekyll connectée", () => {
  let serveur: Express;
  let busEvenements: MockBusEvenement;
  let entrepotUtilisateur: EntrepotUtilisateurMemoire;

  beforeEach(() => {
    entrepotUtilisateur = new EntrepotUtilisateurMemoire();

    busEvenements = fabriqueBusPourLesTests();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
      entrepotUtilisateur,
    });
  });

  describe('sur demande de la page', () => {
    it('utilise le middleware de verification de JWT pour la navigation', async () => {
      let middelwareAppele = false;
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        middleware: {
          ...fauxMiddleware,
          verifieJWTNavigation: async (_, __, suite) => {
            middelwareAppele = true;
            suite();
          },
        },
      });
      const reponse = await request(serveur).get('/favoris');

      assert.equal(middelwareAppele, true);
      assert.equal(reponse.status, 200);
    });

    it("affecte le parcours de l'utilisateur", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        busEvenements,
        entrepotUtilisateur,
        gestionnairesRequêtesComplémentaires: {
          ...fauxGestionnaireRequêtesComplémentaires,
          attributionParcours,
        },
      });

      await request(serveur).get('/parcours-complet').set('Cookie', [cookie]);

      const utilisateur = await entrepotUtilisateur.parEmailHache(jeanneDupont.emailHache());

      assert.equal(utilisateur?.parcoursActuel(), 'complet');
    });
  });

  describe("sur demande d'une mesure", () => {
    it("trace la visite lorsque qu'un utilisateur est connecté", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });

      const reponse = await request(serveur).get('/mesures/AUTH.5').set('Cookie', [cookie]);

      assert.equal(reponse.status, 200);
      busEvenements.aRecuUnEvenement(MesureConsultee);
      const evenement = busEvenements.recupereEvenement(MesureConsultee);
      assert.equal(evenement!.idMesure, 'AUTH.5');
      assert.equal(evenement!.emailHache, 'jeanne.dupont@user.com-hache');
    });

    it("ne trace pas la visite d'une mesure mal nommée", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });

      const reponse = await request(serveur).get('/mesures/auth5').set('Cookie', [cookie]);

      assert.equal(reponse.status, 200);
      busEvenements.naPasRecuDEvenement(MesureConsultee);
    });

    it("affecte le parcours de l'utilisateur selon le module de la mesure consultée", async () => {
      const module = fabriqueModuleCyberdépart();
      const mesure = mesureDeTest().avecLId('PSSI.1').avecIdModule(module.id).construis();
      module.mesures = [mesure];
      const entrepôtModule = new EntrepôtModuleMémoire();
      const entrepotMesure = new EntrepotMesureMemoire();
      await entrepôtModule.ajoute(module);
      await entrepotMesure.ajoute(mesure);
      const utilisateur = new ConstructeurDUtilisateur().avecLEmail('chuck@yopmail.com').construis();
      await entrepotUtilisateur.ajoute(utilisateur);
      const cookie = encodeSession({ email: utilisateur.email, token: 'valide' });
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        busEvenements,
        entrepotUtilisateur,
        entrepôtModule,
        entrepotMesure,
        gestionnairesRequêtesComplémentaires: {
          ...fauxGestionnaireRequêtesComplémentaires,
          attributionParcours,
        },
      });

      await request(serveur).get('/mesures/PSSI.1').set('Cookie', [cookie]);

      const utilisateurMitÀJour = await entrepotUtilisateur.parEmailHache(utilisateur.emailHache());

      assert.equal(utilisateurMitÀJour?.parcoursActuel(), 'allégé');
    });
  });
});
