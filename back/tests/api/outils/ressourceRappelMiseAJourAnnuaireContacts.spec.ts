import { HttpStatusCode } from '@anssi-portail/axios';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { creeServeur } from '../../../src/api/msc/index.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

describe("La ressource du rappel de mise à jour de l'annuaire des contacts", () => {
  describe('sur une requête GET', () => {
    it('réponds 200', async () => {
      const serveur = creeServeur(configurationDeTestDuServeur);

      const { status } = await request(serveur).get('/api/outils/rappel-mise-a-jour-annuaire-contacts.ics');

      expect(status).toBe(HttpStatusCode.Ok);
    });
  });
});
