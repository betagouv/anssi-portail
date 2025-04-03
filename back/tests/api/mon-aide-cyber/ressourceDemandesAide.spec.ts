import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { Express } from 'express';
import { creeServeur } from '../../../src/api/msc';
import { configurationDeTestDuServeur } from '../fauxObjets';
import assert from 'node:assert';

describe('quand requête POST sur `/api/mon-aide-cyber/demandes-aide`', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  it('retourne une 201', async () => {
    const reponse = await request(serveur)
      .post('/api/mon-aide-cyber/demandes-aide')
      .send({});

    assert.equal(reponse.status, 201);
  });
});
