import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import { configurationDeTestDuServeur } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';

describe("La ressource Annuaire Secteurs d'activité", () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/annuaire/secteurs-activite');

      assert.equal(reponse.status, 200);
    });

    it('renvoie les secteurs du référentiel', async () => {
      const reponse = await request(serveur).get('/api/annuaire/secteurs-activite');

      assert.equal(reponse.body[0].libelle, 'Agriculture, sylviculture et pêche');
      assert.equal(reponse.body[0].code, 'A');
    });
  });
});
