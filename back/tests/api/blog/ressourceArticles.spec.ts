import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

describe('La ressource des articles de blog', () => {
  let serveur: Express;

  beforeEach(async () => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur une requête GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/articles');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });
  });
});
