import { Express } from 'express';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../../src/api/msc.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';
import assert from 'node:assert';
import { HttpStatusCode } from '@anssi-portail/axios';

describe('La ressource du questionnaire Vrai-Faux', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });
  describe('sur une requête GET', () => {
    it('répond un 200', async () => {
      const reponse = await request(serveur).get('/api/mini-tests/vrai-faux');

      assert.equal(reponse.status, HttpStatusCode.Ok);
    });
  });
});
