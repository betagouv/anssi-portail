import { HttpStatusCode } from '@anssi-portail/axios';
import { beforeEach, describe, it, expect } from 'vitest';
import { Express } from 'express';
import { configurationDeTestDuServeur, fauxAdaptateurEnvironnement } from './fauxObjets.js';
import { creeServeur } from '../../src/api/msc.js';
import request from 'supertest';
import { AdaptateurEnvironnement } from '../../src/infra/adaptateurEnvironnement.js';

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
