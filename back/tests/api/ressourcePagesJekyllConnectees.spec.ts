import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { fabriquePublieMesureConsultée } from '../../src/api/middlewares/publieMesureConsultee.js';
import { creeServeur } from '../../src/api/msc.js';
import { MesureConsultee } from '../../src/bus/evenements/mesureConsultee.js';
import { Parcours } from '../../src/metier/parcours.js';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../bus/busPourLesTests.js';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire.js';
import { encodeSession } from './cookie.js';
import { configurationDeTestDuServeur, fauxGestionnaireRequêtesComplémentaires, fauxMiddleware } from './fauxObjets.js';
import { jeanneDupont } from './objetsPretsALEmploi.js';

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

      expect(middelwareAppele).toBe(true);
      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it("affecte le parcours de l'utilisateur", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      let parcoursAppellé = '';
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        busEvenements,
        entrepotUtilisateur,
        gestionnairesRequêtesComplémentaires: {
          ...fauxGestionnaireRequêtesComplémentaires,
          attributionParcours: (parcours: Parcours) => async (_requête, _réponse, suite) => {
            parcoursAppellé = parcours;
            suite();
          },
        },
      });

      await request(serveur).get('/parcours-complet').set('Cookie', [cookie]);

      expect(parcoursAppellé).toBe('complet');
    });
  });

  describe("sur demande d'une mesure", () => {
    it("trace la visite lorsque qu'un utilisateur est connecté", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });
      serveur = creeServeur({
        ...configurationDeTestDuServeur,
        busEvenements,
        entrepotUtilisateur,
        gestionnairesRequêtesComplémentaires: {
          ...fauxGestionnaireRequêtesComplémentaires,
          publieMesureConsultée: fabriquePublieMesureConsultée({ busEvenements }),
        },
      });
      const reponse = await request(serveur).get('/mesures/AUTH.5').set('Cookie', [cookie]);

      expect(reponse.status).toBe(HttpStatusCode.Ok);
      busEvenements.aRecuUnEvenement(MesureConsultee);
      const evenement = busEvenements.recupereEvenement(MesureConsultee);
      expect(evenement!.idMesure).toBe('AUTH.5');
      expect(evenement!.email).toBe('jeanne.dupont@user.com');
    });

    it("ne trace pas la visite d'une mesure mal nommée", async () => {
      await entrepotUtilisateur.ajoute(jeanneDupont);
      const cookie = encodeSession({ email: jeanneDupont.email, token: 'valide' });

      const reponse = await request(serveur).get('/mesures/auth5').set('Cookie', [cookie]);

      expect(reponse.status).toBe(HttpStatusCode.Ok);
      busEvenements.naPasRecuDEvenement(MesureConsultee);
    });
  });
});
