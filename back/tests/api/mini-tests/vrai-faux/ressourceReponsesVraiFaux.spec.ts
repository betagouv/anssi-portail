import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../../src/api/msc.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';

describe('La ressource des réponses aux questionnaire Vrai-Faux', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
    });
  });
  describe('sur une requête POST', () => {
    it('répond un 201', async () => {
      const reponse = await request(serveur).post('/api/mini-tests/vrai-faux/reponses');

      assert.equal(reponse.status, HttpStatusCode.Created);
    });
  });
});
