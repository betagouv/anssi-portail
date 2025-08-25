import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { configurationDeTestDuServeur, fauxMiddleware } from './fauxObjets';

describe("La ressource d'une page Jekyll connectée", () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      middleware: fauxMiddleware,
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
});
