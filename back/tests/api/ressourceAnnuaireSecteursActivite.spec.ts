import { HttpStatusCode } from '@anssi-portail/axios';
import { beforeEach, describe, it, expect } from 'vitest';
import { Express } from 'express';
import { configurationDeTestDuServeur } from './fauxObjets.js';
import { creeServeur } from '../../src/api/msc.js';
import request from 'supertest';

describe("La ressource Annuaire Secteurs d'activité", () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/annuaire/secteurs-activite');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie les secteurs du référentiel', async () => {
      const reponse = await request(serveur).get('/api/annuaire/secteurs-activite');

      expect(reponse.body[0].libelle).toBe('Agriculture, sylviculture et pêche');
      expect(reponse.body[0].code).toBe('A');
    });
  });
});
