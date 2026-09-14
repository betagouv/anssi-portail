import { HttpStatusCode } from '@anssi-portail/axios';
import { beforeEach, describe, it, expect } from 'vitest';
import { Express } from 'express';
import { configurationDeTestDuServeur } from './fauxObjets.js';
import { creeServeur } from '../../src/api/msc.js';
import request from 'supertest';

describe("La ressource Annuaire Tranche effectif d'établissements", () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/annuaire/tranches-effectif');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it("renvoie les tranches d'effectif du référentiel", async () => {
      const reponse = await request(serveur).get('/api/annuaire/tranches-effectif');

      expect(reponse.body[1].libelle).toBe('0 salarié');
      expect(reponse.body[1].code).toBe('00');
    });
  });
});
