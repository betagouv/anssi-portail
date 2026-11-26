import { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { HttpStatusCode } from '@anssi-portail/axios';

import { creeServeur } from '@api/msc/index.js';

import { ResultatTestMaturiteCreateur } from '../../../metier/mini-tests/maturite-cyber/ResultatTestMaturiteCreateur.js';
import { EntrepôtRésultatTestMaturitéMémoire } from '../../../persistance/entrepotResultatTestMaturiteMemoire.js';
import { configurationDeTestDuServeur } from '../../fauxObjets.js';
import { unRésultatDeTestDeMaturité } from './constructeurResultatTestMaturite.js';

describe('La ressource qui gère les series de résultats de test de maturité', () => {
  let serveur: Express;
  let entrepôtRésultatTestMaturité: EntrepôtRésultatTestMaturitéMémoire;

  beforeEach(() => {
    entrepôtRésultatTestMaturité = new EntrepôtRésultatTestMaturitéMémoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepôtRésultatTestMaturité,
    });
  });
  describe('sur requête GET', () => {
    it('répond 200', async () => {
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepôtRésultatTestMaturité);
      await createur.creePlusieurs(2);

      const reponse = await request(serveur).get('/api/repartition-resultats-test');

      expect(reponse.status).toBe(HttpStatusCode.Ok);
    });

    it('calcule la moyenne des scores de résultats de même niveau', async () => {
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepôtRésultatTestMaturité);
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
      const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepôtRésultatTestMaturité);
      await createur.deNiveau('insuffisant').cree();
      await createur.deNiveau('emergent').cree();
      await createur.deNiveau('emergent').cree();

      const reponse = await request(serveur).get('/api/repartition-resultats-test');

      expect(reponse.body[0].totalNombreTests).toBe(1);
      expect(reponse.body[1].totalNombreTests).toBe(2);
    });

    it('répond 204 si trop peu de résultats', async () => {
      await entrepôtRésultatTestMaturité.ajoute(await unRésultatDeTestDeMaturité().construis());

      const reponse = await request(serveur).get('/api/repartition-resultats-test');

      expect(reponse.status).toBe(HttpStatusCode.NoContent);
    });

    describe('avec un filtre', () => {
      it('sur le secteur, ne remonte que les résultats de même secteur', async () => {
        const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepôtRésultatTestMaturité);
        await createur.deNiveau('insuffisant').deSecteur('A').cree();
        await createur.deNiveau('insuffisant').deSecteur('A').cree();
        await createur.deNiveau('insuffisant').deSecteur('B').cree();

        const reponse = await request(serveur).get('/api/repartition-resultats-test?secteur=A');

        expect(reponse.body[0].totalNombreTests).toBe(2);
        expect(reponse.body[0].ratio).toBe(1);
      });

      it('sur la région, ne remonte que les résultats de la même région', async () => {
        const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepôtRésultatTestMaturité);
        await createur.deNiveau('insuffisant').deRegion('FR-NOR').cree();
        await createur.deNiveau('insuffisant').deRegion('FR-NOR').cree();
        await createur.deNiveau('insuffisant').deRegion('FR-20R').cree();

        const reponse = await request(serveur).get('/api/repartition-resultats-test?region=FR-NOR');

        expect(reponse.body[0].totalNombreTests).toBe(2);
        expect(reponse.body[0].ratio).toBe(1);
      });

      it("sur la taille d'organisation, ne remonte que les résultats de même taille", async () => {
        const createur = new ResultatTestMaturiteCreateur().dansEntrepot(entrepôtRésultatTestMaturité);
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
