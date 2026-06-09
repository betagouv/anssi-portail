import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { configurationDeTestDuServeur, fauxMiddleware } from './fauxObjets';
import { MesureConsultee } from '../../src/bus/evenements/mesureConsultee';
import { encodeSession } from './cookie';
import { jeanneDupont } from './objetsPretsALEmploi';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';
import { fabriqueBusPourLesTests, MockBusEvenement } from '../bus/busPourLesTests';

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
  });
});
