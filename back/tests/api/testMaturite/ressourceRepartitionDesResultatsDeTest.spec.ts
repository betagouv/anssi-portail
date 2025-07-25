import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { ResultatTestMaturite } from '../../../src/metier/resultatTestMaturite';
import { ResultatTestMaturiteCreateur } from '../../metier/ResultatTestMaturiteCreateur';
import { EntrepotResultatTestMemoire } from '../../persistance/entrepotResultatTestMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';

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
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(
        entrepotResultatTest
      );
      await createur.creePlusieurs(2);

      const reponse = await request(serveur).get(
        '/api/repartition-resultats-test'
      );

      assert.equal(reponse.status, 200);
    });

    it('calcule la moyenne des scores de résultats de même niveau', async () => {
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(
        entrepotResultatTest
      );
      await createur.deNiveau('insuffisant').cree();
      await createur.deNiveau('emergent').cree();
      await createur
        .avecReponses({
          'adoption-solutions': 2,
          'prise-en-compte-risque': 1,
          'ressources-humaines': 1,
          budget: 2,
          pilotage: 3,
          posture: 3,
        })
        .cree();
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
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(
        entrepotResultatTest
      );
      await createur.deNiveau('insuffisant').cree();
      await createur.deNiveau('emergent').cree();
      await createur.deNiveau('emergent').cree();

      const reponse = await request(serveur).get(
        '/api/repartition-resultats-test'
      );

      assert.equal(reponse.body[0].totalNombreTests, 1);
      assert.equal(reponse.body[1].totalNombreTests, 2);
    });

    it('répond 204 si trop peu de résultats', async () => {
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

      const reponse = await request(serveur).get(
        '/api/repartition-resultats-test'
      );

      assert.equal(reponse.status, 204);
    });

    describe('avec un filtre', () => {
      it('sur le secteur, ne remonte que les résultats de même secteur', async () => {
        const createur = new ResultatTestMaturiteCreateur().dansEntrepot(
          entrepotResultatTest
        );
        await createur.deNiveau('insuffisant').deSecteur('A').cree();
        await createur.deNiveau('insuffisant').deSecteur('A').cree();
        await createur.deNiveau('insuffisant').deSecteur('B').cree();

        const reponse = await request(serveur).get(
          '/api/repartition-resultats-test?secteur=A'
        );

        assert.equal(reponse.body[0].totalNombreTests, 2);
      });

      it('sur la région, ne remonte que les résultats de la même région', async () => {
        const createur = new ResultatTestMaturiteCreateur().dansEntrepot(
          entrepotResultatTest
        );
        await createur.deNiveau('insuffisant').deRegion('FR-NOR').cree();
        await createur.deNiveau('insuffisant').deRegion('FR-NOR').cree();
        await createur.deNiveau('insuffisant').deRegion('FR-20R').cree();

        const reponse = await request(serveur).get(
          '/api/repartition-resultats-test?region=FR-NOR'
        );

        assert.equal(reponse.body[0].totalNombreTests, 2);
      });

      it("sur la taille d'organisation, ne remonte que les résultats de même taille", async () => {
        const createur = new ResultatTestMaturiteCreateur().dansEntrepot(
          entrepotResultatTest
        );
        await createur
          .deNiveau('insuffisant')
          .deTailleOrganisation('01')
          .cree();
        await createur
          .deNiveau('insuffisant')
          .deTailleOrganisation('01')
          .cree();
        await createur
          .deNiveau('insuffisant')
          .deTailleOrganisation('11')
          .cree();

        const reponse = await request(serveur).get(
          '/api/repartition-resultats-test?tailleOrganisation=01'
        );

        assert.equal(reponse.body[0].totalNombreTests, 2);
      });
    });
  });
});
