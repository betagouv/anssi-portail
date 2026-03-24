import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import assert from 'node:assert';

import { Express } from 'express';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from '../fauxObjets';
import { creeServeur } from '../../../src/api/msc';
import { AdaptateurEnvironnement } from '../../../src/infra/adaptateurEnvironnement';

describe('La ressource qui gère le simulateur NIS2', () => {
  let serveur: Express;
  let environnementDuTest: AdaptateurEnvironnement;

  beforeEach(() => {
    environnementDuTest = {
      ...fauxAdaptateurEnvironnement,
      fonctionnalites: () => ({ nis2: () => ({ afficheSimulateur: () => true }) }),
    } as unknown as AdaptateurEnvironnement;

    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurEnvironnement: environnementDuTest,
    });
  });

  describe('sur requête POST', () => {
    it('répond 201 avec le contenu de ce qui est reçu, temporairement', async () => {
      const reponse = await request(serveur).post('/api/simulateur-nis2').send({ question1: false });

      assert.equal(reponse.status, 201);
      assert.deepEqual(reponse.body, { question1: false });
    });
  });
});
