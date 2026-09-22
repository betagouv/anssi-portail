import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc.js';
import { configurationDeTestDuServeur } from './fauxObjets.js';

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
