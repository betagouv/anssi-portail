import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { ResultatTestMaturite } from '../../../src/metier/resultatTestMaturite';
import { EntrepotResultatTestMemoire } from '../../persistance/entrepotResultatTestMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';
import { creeResultatTest } from '../objetsPretsALEmploi';

describe('La ressource qui gère les series de résultats de test de maturité', () => {
  let serveur: Express;
  let entrepotResultatTest: EntrepotResultatTestMemoire;

  beforeEach(() => {
    entrepotResultatTest = new EntrepotResultatTestMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotResultatTest,
    });
  });
  describe('sur requête GET', () => {
    it('répond 200', async () => {
      const reponse = await request(serveur).get(
        '/api/repartition-resultats-test'
      );

      assert.equal(reponse.status, 200);
    });

    it('calcule la moyenne des scores de résultats de même niveau', async () => {
      entrepotResultatTest.ajoute(
        new ResultatTestMaturite({
          secteur: 'A',
          region: 'FR-NOR',
          id: 'test-id-1',
          reponses: {
            'adoption-solutions': 1,
            'prise-en-compte-risque': 1,
            'ressources-humaines': 1,
            budget: 1,
            pilotage: 1,
            posture: 1,
          },
          tailleOrganisation: '01',
        })
      );
      entrepotResultatTest.ajoute(
        new ResultatTestMaturite({
          secteur: 'A',
          region: 'FR-NOR',
          id: 'test-id-2',
          reponses: {
            'adoption-solutions': 2,
            'prise-en-compte-risque': 2,
            'ressources-humaines': 2,
            budget: 2,
            pilotage: 2,
            posture: 2,
          },
          tailleOrganisation: '01',
        })
      );
      entrepotResultatTest.ajoute(
        new ResultatTestMaturite({
          secteur: 'A',
          region: 'FR-NOR',
          id: 'test-id-2',
          reponses: {
            'adoption-solutions': 2,
            'prise-en-compte-risque': 1,
            'ressources-humaines': 1,
            budget: 2,
            pilotage: 3,
            posture: 3,
          },
          tailleOrganisation: '01',
        })
      );
      const reponse = await request(serveur).get(
        '/api/repartition-resultats-test'
      );

      assert.equal(reponse.body.length, 2);
      assert.equal(reponse.body[0].id, 'insuffisant');
      assert.deepEqual(reponse.body[0].valeurs, {
        'prise-en-compte-risque': 1,
        pilotage: 1,
        budget: 1,
        'ressources-humaines': 1,
        'adoption-solutions': 1,
        posture: 1,
      });
      assert.equal(reponse.body[1].id, 'emergent');
      assert.deepEqual(reponse.body[1].valeurs, {
        'prise-en-compte-risque': 1.5,
        pilotage: 2.5,
        budget: 2,
        'ressources-humaines': 1.5,
        'adoption-solutions': 2,
        posture: 2.5,
      });
    });

    it('calcule le nombre total de test par niveau', async () => {
      await entrepotResultatTest.ajoute(creeResultatTest('insuffisant'));
      await entrepotResultatTest.ajoute(creeResultatTest('emergent'));
      await entrepotResultatTest.ajoute(creeResultatTest('emergent'));

      const reponse = await request(serveur).get(
        '/api/repartition-resultats-test'
      );

      assert.equal(reponse.body[0].totalNombreTests, 1);
      assert.equal(reponse.body[1].totalNombreTests, 2);
    });
  });
});
