import { HttpStatusCode } from '@anssi-portail/axios';
import { Express } from 'express';
import { beforeEach, describe, it, expect } from 'vitest';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc.js';
import { ResultatTestMaturite } from '../../../src/metier/resultatTestMaturite.js';
import { ResultatTestMaturiteCreateur } from '../../metier/ResultatTestMaturiteCreateur.js';
import { EntrepotResultatTestMemoire } from '../../persistance/entrepotResultatTestMemoire.js';
import { configurationDeTestDuServeur } from '../fauxObjets.js';

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
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepotResultatTest);
      await createur.creePlusieurs(2);

      const reponse = await request(serveur).get('/api/repartition-resultats-test');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('calcule la moyenne des scores de résultats de même niveau', async () => {
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepotResultatTest);
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
      const reponse = await request(serveur).get('/api/repartition-resultats-test');

      expect(reponse.body).toHaveLength(2);
      expect(reponse.body[0].id).toBe('insuffisant');
      expect(reponse.body[0].valeurs).toEqual({
        'prise-en-compte-risque': 1,
        pilotage: 1,
        budget: 1,
        'ressources-humaines': 1,
        'adoption-solutions': 1,
        posture: 1,
      });
      expect(reponse.body[1].id).toBe('emergent');
      expect(reponse.body[1].valeurs).toEqual({
        'prise-en-compte-risque': 1.5,
        pilotage: 2.5,
        budget: 2,
        'ressources-humaines': 1.5,
        'adoption-solutions': 2,
        posture: 2.5,
      });
    });

    it('calcule le nombre total de test par niveau', async () => {
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepotResultatTest);
      await createur.deNiveau('insuffisant').cree();
      await createur.deNiveau('emergent').cree();
      await createur.deNiveau('emergent').cree();

      const reponse = await request(serveur).get('/api/repartition-resultats-test');

      expect(reponse.body[0].totalNombreTests).toBe(1);
      expect(reponse.body[1].totalNombreTests).toBe(2);
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

      const reponse = await request(serveur).get('/api/repartition-resultats-test');

      expect(reponse.status).toBe(HttpStatusCode.NoContent);
    });

    describe('avec un filtre', () => {
      it('sur le secteur, ne remonte que les résultats de même secteur', async () => {
        const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepotResultatTest);
        await createur.deNiveau('insuffisant').deSecteur('A').cree();
        await createur.deNiveau('insuffisant').deSecteur('A').cree();
        await createur.deNiveau('insuffisant').deSecteur('B').cree();

        const reponse = await request(serveur).get('/api/repartition-resultats-test?secteur=A');

        expect(reponse.body[0].totalNombreTests).toBe(2);
        expect(reponse.body[0].ratio).toBe(1);
      });

      it('sur la région, ne remonte que les résultats de la même région', async () => {
        const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepotResultatTest);
        await createur.deNiveau('insuffisant').deRegion('FR-NOR').cree();
        await createur.deNiveau('insuffisant').deRegion('FR-NOR').cree();
        await createur.deNiveau('insuffisant').deRegion('FR-20R').cree();

        const reponse = await request(serveur).get('/api/repartition-resultats-test?region=FR-NOR');

        expect(reponse.body[0].totalNombreTests).toBe(2);
        expect(reponse.body[0].ratio).toBe(1);
      });

      it("sur la taille d'organisation, ne remonte que les résultats de même taille", async () => {
        const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepotResultatTest);
        await createur.deNiveau('insuffisant').deTailleOrganisation('01').cree();
        await createur.deNiveau('insuffisant').deTailleOrganisation('01').cree();
        await createur.deNiveau('insuffisant').deTailleOrganisation('11').cree();

        const reponse = await request(serveur).get('/api/repartition-resultats-test?tailleOrganisation=01');

        expect(reponse.body[0].totalNombreTests).toBe(2);
        expect(reponse.body[0].ratio).toBe(1);
      });
    });
  });
});
