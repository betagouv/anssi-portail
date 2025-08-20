import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { EntrepotFinancementMemoire } from '../persistance/entrepotFinancementMemoire';
import { configurationDeTestDuServeur } from './fauxObjets';
import { financementCyberPME } from './objetsPretsALEmploi';

describe('La ressource Financements', () => {
  let serveur: Express;
  let entrepotFinancement: EntrepotFinancementMemoire;

  beforeEach(() => {
    entrepotFinancement = new EntrepotFinancementMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotFinancement,
    });
  });
  describe('sur demande GET', () => {
    it('renvoie un 200', async () => {
      const reponse = await request(serveur).get('/api/financements');

      assert.equal(reponse.status, 200);
    });

    it('renvoie une liste de financements', async () => {
      await entrepotFinancement.ajoute(financementCyberPME);

      const reponse = await request(serveur).get('/api/financements');

      assert.deepEqual(reponse.body, [
        {
          id: 1,
          nom: 'Cyber PME',
          financeur: 'BPI France',
          typesDeFinancement: ['Formation'],
          entitesElligibles: ['PME', 'ETI'],
          perimetresGeographiques: ['France'],
          regions: ["FRANCE"],
        },
      ]);
    });

    it("renvoie un 500 si l'entrepot renvoie une erreur", async () => {
      entrepotFinancement.tous = () => {
        throw new Error('Erreur technique');
      };
      const reponse = await request(serveur).get('/api/financements');

      assert.equal(reponse.status, 500);
    });
  });
});
