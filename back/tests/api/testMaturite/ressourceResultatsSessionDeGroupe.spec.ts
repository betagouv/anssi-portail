import { Express } from 'express';
import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import request from 'supertest';
import { creeServeur } from '../../../src/api/msc';
import { EntrepotResultatTest } from '../../../src/metier/entrepotResultatTest';
import { EntrepotSessionDeGroupe } from '../../../src/metier/entrepotSessionDeGroupe';
import {
  DonneesCreationResultatTestMaturite,
  ResultatTestMaturite,
} from '../../../src/metier/resultatTestMaturite';
import { SessionDeGroupe } from '../../../src/metier/sessionDeGroupe';
import { EntrepotResultatTestMemoire } from '../../persistance/entrepotResultatTestMemoire';
import { EntrepotSessionDeGroupeMemoire } from '../../persistance/EntrepotSessionDeGroupeMemoire';
import { configurationDeTestDuServeur } from '../fauxObjets';

describe("La ressource qui gère les résultats d'une session de groupe", () => {
  let serveur: Express;
  let entrepotSessionDeGroupe: EntrepotSessionDeGroupe;
  let entrepotResultatTest: EntrepotResultatTest;
  const generateurCodeSessionDeGroupe = (code: string) => ({
    genere: async () => code,
  });

  const donneesResultatTest: Omit<
    DonneesCreationResultatTestMaturite,
    'utilisateur'
  > = {
    region: 'FR-NOR',
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
    codeSessionGroupe: 'ABC2ED',
  };

  beforeEach(() => {
    entrepotResultatTest = new EntrepotResultatTestMemoire();
    entrepotSessionDeGroupe = new EntrepotSessionDeGroupeMemoire();
    serveur = creeServeur({
      ...configurationDeTestDuServeur,
      entrepotSessionDeGroupe,
      entrepotResultatTest,
    });
  });

  describe('sur requête GET', () => {
    it('répond 200 lorsque la session existe', async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree(
        generateurCodeSessionDeGroupe('ABC2ED')
      );
      await entrepotSessionDeGroupe.ajoute(sessionDeGroupe);

      const reponse = await request(serveur)
        .get('/api/sessions-groupe/ABC2ED/resultats')
        .send();

      assert.equal(reponse.status, 200);
    });

    it("répond 404 si la session n'existe pas", async () => {
      const reponse = await request(serveur)
        .get('/api/sessions-groupe/ABC2ED/resultats')
        .send();

      assert.equal(reponse.status, 404);
    });

    it("répond 0 participant en cas d'absence de résultats", async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree(
        generateurCodeSessionDeGroupe('ABC2ED')
      );
      await entrepotSessionDeGroupe.ajoute(sessionDeGroupe);

      const reponse = await request(serveur)
        .get('/api/sessions-groupe/ABC2ED/resultats')
        .send();

      assert.deepEqual(reponse.body.nombreParticipants, 0);
    });

    it('répond le nombre de participants en cas de résultats', async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree(
        generateurCodeSessionDeGroupe('ABC2ED')
      );
      await entrepotSessionDeGroupe.ajoute(sessionDeGroupe);
      await entrepotResultatTest.ajoute(
        new ResultatTestMaturite({
          ...donneesResultatTest,
          codeSessionGroupe: 'ABC2ED',
        })
      );

      const reponse = await request(serveur)
        .get('/api/sessions-groupe/ABC2ED/resultats')
        .send();

      assert.deepEqual(reponse.body.nombreParticipants, 1);
    });
  });
});
