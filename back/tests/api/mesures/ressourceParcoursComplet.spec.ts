import assert from 'node:assert';
import { describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

describe('La ressource du parcours complet', () => {
  describe('sur requête GET', () => {
    it('retourne 200', async () => {
      const serveur = creeServeur(configurationDeTestDuServeur);

      const reponse = await request(serveur).get('/api/parcours/complet');

      const statut = reponse.status;
      assert.equal(statut, 200);
    });
  });
});
