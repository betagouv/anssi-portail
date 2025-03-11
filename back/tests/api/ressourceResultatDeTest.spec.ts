import { beforeEach, describe, it } from 'node:test';
import { Express } from 'express';
import { creeServeur } from '../../src/api/msc';
import { configurationDeTestDuServeur } from './fauxObjets';
import request from 'supertest';
import assert from 'node:assert';
import {
  fabriqueBusPourLesTests,
  MockBusEvenement,
} from '../bus/busPourLesTests';
import { TestRealise } from '../../src/bus/testRealise';

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
      ...configurationDeTestDuServeur,
      busEvenements: busEvenement,
    });
  });

  describe('sur requête POST', () => {
    it('répond 201', async () => {
      const reponse = await request(serveur)
        .post('/api/resultats-test')
        .send(donneesCorrectes);

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

    describe('concernant la validation des données', () => {
      const requeteAvecDonneeIncorrecte = async (
        donnees: Record<string, any>
      ) => {
        const reponse = await request(serveur)
          .post('/api/resultats-test')
          .send({
            ...donneesCorrectes,
            ...donnees,
          });
        return reponse;
      };

      it('aseptise les paramètres', async () => {
        await request(serveur)
          .post('/api/resultats-test')
          .send({
            region: 'Normandie  ',
            secteur: 'J  ',
            tailleOrganisation: '51     ',
            reponses: {
              'prise-en-compte-risque': '2>',
            },
          });

        const evenement = busEvenement.recupereEvenement(TestRealise);
        assert.equal(evenement!.region, 'Normandie');
        assert.equal(evenement!.secteur, 'J');
        assert.equal(evenement!.tailleOrganisation, '51');
        assert.equal(evenement!.reponses['prise-en-compte-risque'], '2&gt;');
      });

      it('valide la région', async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          region: 'UneRegionInconnue',
        });

        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, 'Région invalide');
      });

      it('valide le secteur', async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          secteur: 'UnSecteurInconnu',
        });

        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, 'Secteur invalide');
      });

      it("valide la taille d'organisation", async () => {
        const reponse = await requeteAvecDonneeIncorrecte({
          tailleOrganisation: 'UneTailleInconnue',
        });

        assert.equal(reponse.status, 400);
        assert.equal(reponse.body.erreur, "Taille d'organisation invalide");
      });

      describe('concernant les réponses', () => {
        it('valide que les réponses sont dans un objet', async () => {
          const reponse = await requeteAvecDonneeIncorrecte({
            reponses: ['pasUnObjet'],
          });

          assert.equal(reponse.status, 400);
          assert.equal(
            reponse.body.erreur,
            'Les réponses doivent être dans un objet'
          );
        });

        it('valide les clés de réponses', async () => {
          const reponse = await requeteAvecDonneeIncorrecte({
            reponses: { uneAutreClé: 1 },
          });

          assert.equal(reponse.status, 400);
          assert.equal(
            reponse.body.erreur,
            'Les clés de réponse sont invalides'
          );
        });

        it('valide les valeurs de reponses', async () => {
          const reponse = await requeteAvecDonneeIncorrecte({
            reponses: { ...donneesCorrectes.reponses, pilotage: 0 },
          });

          assert.equal(reponse.status, 400);
          assert.equal(
            reponse.body.erreur,
            'Les valeurs de réponses doivent être comprises entre 1 et 5'
          );
        });
      });
    });
  });
});
