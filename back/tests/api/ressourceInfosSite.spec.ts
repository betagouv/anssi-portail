import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../src/api/msc.js';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement.js';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from './fauxObjets.js';

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

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it("retourne le jour et l'heure de la maintenance en préparation", async () => {
      adaptateurEnvironnement.maintenance = () => ({
        actif: () => false,
        detailsPreparation: () => 'Vendredi 20 juin - 13h à 14h',
      });

      const reponse = await request(serveur).get('/api/infos-site');

      expect(reponse.body.maintenanceEnPreparation).toBeDefined();
      const { jour, heure } = reponse.body.maintenanceEnPreparation;
      expect(jour).toBe('Vendredi 20 juin');
      expect(heure).toBe('13h à 14h');
    });

    it("n'est pas défini si aucune maintenance en préparation", async () => {
      adaptateurEnvironnement.maintenance = () => ({
        actif: () => false,
        detailsPreparation: () => undefined,
      });

      const reponse = await request(serveur).get('/api/infos-site');

      expect(reponse.body.maintenanceEnPreparation).toBeUndefined();
    });
  });
});
