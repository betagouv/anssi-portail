import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

describe("La ressource du modèle de l'annuaire de crise", () => {
  let serveur: Express;
  describe('sur une requête GET', () => {
    it('réponds 200', async () => {
      serveur = creeServeur(configurationDeTestDuServeur);

      const { status } = await request(serveur).get('/api/outils/modele-annuaire-de-crise.xlsx');

      expect(status).toBe(HttpStatusCode.Ok);
    });
  });
});
