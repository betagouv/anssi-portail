import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../src/api/msc';
import { Financement } from '../../src/metier/financement';
import { EntrepotFinancementMemoire } from '../persistance/entrepotFinancementMemoire';
import { configurationDeTestDuServeur } from './fauxObjets';

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
      entrepotFinancement.ajoute(
        new Financement({
          id: 1,
          nom: 'Cyber PME',
          financeur: 'BPI France',
          typesDeFinancement: ['Formation'],
          entitesElligibles: ['PME', 'ETI'],
          perimetreGeographique: ['France'],
          regions: [],
          objectifs: 'objectif 1',
          operationsElligibles: 'opération 2',
          benificiaires: 'Tout le monde',
          montant: 'Mille milliards',
          sources: ['Le Gorafi'],
          contact: 'aide.entreprise@mail.fr',
        })
      );

      const reponse = await request(serveur).get('/api/financements');

      assert.deepEqual(reponse.body, [
        {
          id: 1,
          nom: 'Cyber PME',
          financeur: 'BPI France',
          typesDeFinancement: ['Formation'],
          entitesElligibles: ['PME', 'ETI'],
          perimetreGeographique: ['France'],
          regions: [],
          objectifs: 'objectif 1',
          operationsElligibles: 'opération 2',
          benificiaires: 'Tout le monde',
          montant: 'Mille milliards',
          sources: ['Le Gorafi'],
          contact: 'aide.entreprise@mail.fr',
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
