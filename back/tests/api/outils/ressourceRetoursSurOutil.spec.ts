import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

describe("La ressource qui gère les retours d'un outil", () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });
  describe('sur une requête GET', () => {
    it('réponds 201', async () => {
      const { status } = await request(serveur).post('/api/outils/retours/modele-annuaire-de-crise.xlsx').send();

      expect(status).toBe(HttpStatusCode.Created);
    });
  });
});
