import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

describe('La ressource Annuaire Départements', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/annuaire/departements');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie les départements du référentiel', async () => {
      const reponse = await request(serveur).get('/api/annuaire/departements');

      expect(reponse.body[0].nom).toBe('Ain');
      expect(reponse.body[0].code).toBe('01');
    });
  });
});
