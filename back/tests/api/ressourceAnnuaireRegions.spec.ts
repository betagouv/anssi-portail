import { HttpStatusCode } from '@anssi-portail/axios';
import { beforeEach, describe, it, expect } from 'vitest';
import { Express } from 'express';
import { configurationDeTestDuServeur } from './fauxObjets.js';
import { creeServeur } from '../../src/api/msc.js';
import request from 'supertest';

describe('La ressource Annuaire Régions', () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/annuaire/regions');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie les régions du référentiel', async () => {
      const reponse = await request(serveur).get('/api/annuaire/regions');

      expect(reponse.body[0].nom).toBe('Auvergne-Rhône-Alpes');
      expect(reponse.body[0].codeIso).toBe('FR-ARA');
    });
  });
});
