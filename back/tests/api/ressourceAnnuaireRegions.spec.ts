import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import { configurationDeTestDuServeur } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';

describe('La ressource Annuaire Régions', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/annuaire/regions');

      assert.equal(reponse.status, 200);
    });

    it('renvoie les régions du référentiel', async () => {
      const reponse = await request(serveur).get('/api/annuaire/regions');

      assert.equal(reponse.body[0].nom, 'Auvergne-Rhône-Alpes');
      assert.equal(reponse.body[0].codeIso, 'FR-ARA');
    });
  });
});
