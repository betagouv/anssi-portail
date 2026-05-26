import assert from 'node:assert';
import { describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';

describe('La ressource mesure de sécurité', () => {
  describe('sur requête GET', () => {
    it('réponds 200', async () => {
      const serveur = creeServeur(configurationDeTestDuServeur);

      const reponse = await request(serveur).get('/api/mesures/AUTH.5');

      assert.equal(reponse.status, 200);
    });
  });
});
