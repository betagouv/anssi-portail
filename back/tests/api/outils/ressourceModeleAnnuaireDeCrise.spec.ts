import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

describe("La ressource du modèle de l'annuaire de crise", () => {
  let serveur: Express;

  beforeEach(() => {
    serveur = creeServeur(configurationDeTestDuServeur);
  });

  describe('sur une requête GET', () => {
    const récupèreModèle = async () => request(serveur).get('/api/outils/modele-annuaire-de-crise.xlsx');

    it('réponds 200', async () => {
      const { status } = await récupèreModèle();

      expect(status).toBe(HttpStatusCode.Ok);
    });

    it('renvoie un contenu XLSX', async () => {
      const { headers } = await récupèreModèle();

      expect(headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(headers['content-disposition']).toBe('attachment; filename="modele-annuaire-de-crise.xlsx"');
    });
  });
});
