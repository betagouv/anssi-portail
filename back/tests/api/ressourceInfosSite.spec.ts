import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import assert from 'node:assert';
import {
  configurationDeTestDuServeur,
  fauxAdaptateurEnvironnement,
} from './fauxObjets';
import { creeServeur } from '../../src/api/msc';
import request from 'supertest';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement';

describe('La ressource Informations du site', () => {
  let serveur: Express;
  let adaptateurEnvironnement: AdaptateurEnvironnement;

  beforeEach(() => {
    adaptateurEnvironnement = { ...fauxAdaptateurEnvironnement };
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      adaptateurEnvironnement,
    });
  });

  describe('sur demande GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get('/api/infos-site');

      assert.equal(reponse.status, 200);
    });

    it("retourne le jour et l'heure de la maintenance en préparation", async () => {
      adaptateurEnvironnement.maintenance = () => ({
        actif: () => false,
        detailsPreparation: () => 'Vendredi 20 juin - 13h à 14h',
      });

      const reponse = await request(serveur).get('/api/infos-site');

      assert.notEqual(reponse.body.maintenanceEnPreparation, undefined);
      const { jour, heure } = reponse.body.maintenanceEnPreparation;
      assert.equal(jour, 'Vendredi 20 juin');
      assert.equal(heure, '13h à 14h');
    });

    it("n'est pas défini si aucune maintenance en préparation", async () => {
      adaptateurEnvironnement.maintenance = () => ({
        actif: () => false,
        detailsPreparation: () => undefined,
      });

      const reponse = await request(serveur).get('/api/infos-site');

      assert.equal(reponse.body.maintenanceEnPreparation, undefined);
    });
  });
});
