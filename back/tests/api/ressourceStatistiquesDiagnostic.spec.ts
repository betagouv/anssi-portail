import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { STATS_DIAGNOSTIC } from '../../src/api/ressourceStatistiquesDiagnostic';
import { configurationDeTestDuServeur } from './fauxObjets';

describe('La ressource Statistiques de diagnostic', () => {
  describe('sur demande GET', () => {
    let serveur: Express;

    beforeEach(() => {
      serveur = creeServeur(configurationDeTestDuServeur);
    });

    it('renvoie 200', async () => {
      const reponse = await request(serveur).get(
        '/api/diagnostic/statistiques'
      );

      assert.equal(reponse.status, 200);
    });

    it('renvoie les statistiques', async () => {
      const reponse = await request(serveur).get(
        '/api/diagnostic/statistiques'
      );

      assert.deepEqual(reponse.body, STATS_DIAGNOSTIC);
    });
  });
});
