import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../../src/api/msc.js';
import { TestExpositionRéalisé } from '../../../../src/bus/evenements/TestExpositionRealise.js';
import { MockBusEvenement } from '../../../bus/busPourLesTests.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';

describe('La ressource des tests d’exposition', () => {
  let serveur: Express;
  let busEvenements: MockBusEvenement;
  beforeEach(() => {
    busEvenements = new MockBusEvenement();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      busEvenements,
    });
  });

  describe('sur requête POST', () => {
    it('répond 201', async () => {
      const réponse = await request(serveur).post('/api/mini-tests/exposition/tests').send();

      assert.equal(réponse.status, HttpStatusCode.Created);
    });

    it('émet un événement sur le bus', async () => {
      await request(serveur).post('/api/mini-tests/exposition/tests').send();

      assert(busEvenements.aRecuUnEvenement(TestExpositionRéalisé));
    });
  });
});
