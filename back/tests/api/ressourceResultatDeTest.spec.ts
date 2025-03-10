import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import { creeServeur } from '../../src/api/msc';
import {
  fauxAdaptateurJWT,
  fauxAdaptateurOIDC,
  fauxFournisseurDeChemin,
} from './fauxObjets';
import { fabriqueMiddleware } from '../../src/api/middleware';
import request from 'supertest';
import assert from 'node:assert';
import {
  fabriqueBusPourLesTests,
  MockBusEvenement,
} from '../bus/busPourLesTests';
import { TestRealise } from '../../src/bus/testRealise';
import { EntrepotUtilisateurMemoire } from '../persistance/entrepotUtilisateurMemoire';

describe('La ressource qui gère les résultats de test de maturité', () => {
  let serveur: Express;
  let busEvenement: MockBusEvenement;

  const donneesCorrectes = {
    region: 'Normandie',
    secteur: 'J',
    tailleOrganisation: '51',
    reponses: {
      'prise-en-compte-risque': 2,
      pilotage: 3,
      budget: 5,
      'ressources-humaines': 3,
      'adoption-solutions': 2,
      posture: 3,
    },
  };

  beforeEach(() => {
    busEvenement = fabriqueBusPourLesTests();
    serveur = creeServeur({
      fournisseurChemin: fauxFournisseurDeChemin,
      middleware: fabriqueMiddleware(),
      adaptateurOIDC: fauxAdaptateurOIDC,
      adaptateurJWT: fauxAdaptateurJWT,
      entrepotUtilisateur: new EntrepotUtilisateurMemoire(),
      trustProxy: '0',
      busEvenement,
    });
  });

  describe('sur requête POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur).post('/api/resultats-test').send(donneesCorrectes);

      assert.equal(reponse.status, 201);
    });

    it('publie un évènement du bus TestRealise', async () => {
      await request(serveur)
        .post('/api/resultats-test')
        .send({
          region: 'Normandie',
          secteur: 'J',
          tailleOrganisation: '51',
          reponses: {
            'prise-en-compte-risque': 2,
            pilotage: 3,
            budget: 5,
            'ressources-humaines': 3,
            'adoption-solutions': 2,
            posture: 3,
          },
        });

      busEvenement.aRecuUnEvenement(TestRealise);
      let evenement = busEvenement.recupereEvenement(TestRealise);
      assert.equal(evenement!.region, 'Normandie');
      assert.equal(evenement!.secteur, 'J');
      assert.equal(evenement!.tailleOrganisation, '51');
      assert.deepEqual(evenement!.reponses, {
        'prise-en-compte-risque': 2,
        pilotage: 3,
        budget: 5,
        'ressources-humaines': 3,
        'adoption-solutions': 2,
        posture: 3,
      });
    });

    it('aseptise les paramètres', async () => {
      await request(serveur)
        .post('/api/resultats-test')
        .send({
          region: 'Normandie  ',
          secteur: 'J<',
          tailleOrganisation: '51     ',
          reponses: {
            'prise-en-compte-risque': '2>',
          },
        });

      const evenement = busEvenement.recupereEvenement(TestRealise);
      assert.equal(evenement!.region, 'Normandie');
      assert.equal(evenement!.secteur, 'J&lt;');
      assert.equal(evenement!.tailleOrganisation, '51');
      assert.equal(evenement!.reponses['prise-en-compte-risque'], '2&gt;');
    });

    it('valide la région', async () => {
      const reponse = await request(serveur)
        .post('/api/resultats-test')
        .send({
          ...donneesCorrectes,
          region: 'UneRegionInconnue',
        });

      assert.equal(reponse.status, 400);
      assert.equal(reponse.body.erreur, 'Région invalide');
    });
  });
});
