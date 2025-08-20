import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import { EntrepotFinancementMemoire } from '../persistance/entrepotFinancementMemoire';
import { creeServeur } from '../../src/api/msc';
import { configurationDeTestDuServeur } from './fauxObjets';
import assert from 'node:assert';
import request from 'supertest';
import { financementCyberPME } from './objetsPretsALEmploi';

describe('La ressource Financement', () => {
  let serveur: Express;
  let entrepotFinancement: EntrepotFinancementMemoire;

  beforeEach(() => {
    entrepotFinancement = new EntrepotFinancementMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotFinancement,
    });
  });

  describe('sur un GET', () => {
    it('renvoie un 200', async () => {
      await entrepotFinancement.ajoute(financementCyberPME);

      const { status } = await request(serveur).get('/api/financements/1');

      assert.equal(status, 200);
    });

    it("renvoie le détail d'un financement", async () => {
      await entrepotFinancement.ajoute(financementCyberPME);

      const reponse = await request(serveur).get('/api/financements/1');

      assert.deepEqual(reponse.body, {
        id: 1,
        nom: 'Cyber PME',
        financeur: 'BPI France',
        typesDeFinancement: ['Formation'],
        entitesElligibles: ['PME', 'ETI'],
        perimetresGeographiques: ['France'],
        regions: ['FRANCE'],
        objectifs: 'objectif 1',
        operationsEligibles: 'opération 2',
        benificiaires: 'Tout le monde',
        montant: 'Mille milliards',
        condition: 'Avoir 10 doigts',
        sources: ['Le Gorafi'],
        contact: 'aide.entreprise@mail.fr',
      });
    });

    it("renvoie un 404 si l'id n'existe pas", async () => {
      const { status } = await request(serveur).get('/api/financements/1');

      assert.equal(status, 404);
    });

    it("renvoie un 400 si l'id n'est pas un nombre", async () => {
      const { status } = await request(serveur).get(
        '/api/financements/un_mauvais_id'
      );

      assert.equal(status, 400);
    });
  });
});
