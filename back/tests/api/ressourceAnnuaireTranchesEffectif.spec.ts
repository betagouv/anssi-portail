import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import { configurationDeTestDuServeur } from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';

describe("La ressource Annuaire Tranche effectif d'établissements", () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get(
        '/api/annuaire/tranches-effectif'
      );

      assert.equal(reponse.status, 200);
    });

    it("renvoie les tranches d'effectif du référentiel", async () => {
      const reponse = await request(serveur).get(
        '/api/annuaire/tranches-effectif'
      );

      assert.equal(reponse.body[0].libelle, '0 salarié');
      assert.equal(reponse.body[0].code, '00');
    });
  });
});
