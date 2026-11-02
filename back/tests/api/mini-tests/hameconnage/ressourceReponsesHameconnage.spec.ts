import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../../src/api/msc/index.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';

describe('La ressource des réponses au mini test hameçonnage', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
    });
  });

  describe('sur une requête POST', () => {
    it("répond une 400 si la charge utile n'est pas valide", async () => {
      const réponse = await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'INCORRECT',
        réponse: 'non',
      });

      expect(réponse.status).toBe(HttpStatusCode.BadRequest);
    });

    it('répond un 201', async () => {
      const réponse = await request(serveur).post('/api/mini-tests/hameconnage/reponses').send({
        idCorrélation: '01a19bd7-6c3f-7592-9c6c-d12de96cbef1',
        idMail: 'ENEDIS',
        réponse: 'bonne',
      });

      expect(réponse.status).toBe(HttpStatusCode.Created);
    });
  });
});
