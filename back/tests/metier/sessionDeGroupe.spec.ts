import { describe, it } from 'node:test';
import { SessionDeGroupe } from '../../src/metier/sessionDeGroupe';
import { EntrepotResultatTestMemoire } from '../persistance/entrepotResultatTestMemoire';
import assert from 'assert';
import {
  ReponsesTestMaturite,
  ResultatTestMaturite,
} from '../../src/metier/resultatTestMaturite';

const resultatAvecReponses = (
  reponses: ReponsesTestMaturite,
  codeSession: string
) =>
  new ResultatTestMaturite({
    emailUtilisateur: undefined,
    region: 'FR-NOR',
    secteur: 'J',
    tailleOrganisation: '51',
    codeSessionGroupe: codeSession,
    reponses,
  });

describe('La session de groupe', () => {
  describe('sur demande des résultats', () => {
    it('donne un résumé sans résultat', async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree({
        genere: async () => 'ABCD',
      });
      const entrepotResultatTest = new EntrepotResultatTestMemoire();

      const resultatSession =
        await sessionDeGroupe.resultatSession(entrepotResultatTest);

      assert.equal(resultatSession.nombreParticipants, 0);
      assert.equal(resultatSession.resume['insuffisant'].total, 0);
      assert.equal(resultatSession.resume['emergent'].total, 0);
      assert.equal(resultatSession.resume['intermediaire'].total, 0);
      assert.equal(resultatSession.resume['confirme'].total, 0);
      assert.equal(resultatSession.resume['optimal'].total, 0);
      const moyennesAZero = {
        'prise-en-compte-risque': 0,
        pilotage: 0,
        budget: 0,
        'ressources-humaines': 0,
        'adoption-solutions': 0,
        posture: 0,
      };
      assert.deepEqual(
        resultatSession.resume['insuffisant'].moyennes,
        moyennesAZero
      );
      assert.deepEqual(
        resultatSession.resume['emergent'].moyennes,
        moyennesAZero
      );
      assert.deepEqual(
        resultatSession.resume['intermediaire'].moyennes,
        moyennesAZero
      );
      assert.deepEqual(
        resultatSession.resume['confirme'].moyennes,
        moyennesAZero
      );
      assert.deepEqual(
        resultatSession.resume['optimal'].moyennes,
        moyennesAZero
      );
    });

    it('donne un résumé avec résultats avec les totaux de participant par niveau', async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree({
        genere: async () => 'ABCD',
      });
      const entrepotResultatTest = new EntrepotResultatTestMemoire();
      await entrepotResultatTest.ajoute(
        resultatAvecReponses(
          {
            'prise-en-compte-risque': 3,
            pilotage: 3,
            budget: 3,
            'ressources-humaines': 4,
            'adoption-solutions': 4,
            posture: 4,
          },
          'ABCD'
        )
      );
      await entrepotResultatTest.ajoute(
        resultatAvecReponses(
          {
            'prise-en-compte-risque': 1,
            pilotage: 1,
            budget: 1,
            'ressources-humaines': 1,
            'adoption-solutions': 1,
            posture: 1,
          },
          'ABCD'
        )
      );

      const resultatSession =
        await sessionDeGroupe.resultatSession(entrepotResultatTest);

      assert.equal(resultatSession.nombreParticipants, 2);
      assert.equal(resultatSession.resume['insuffisant'].total, 1);
      assert.equal(resultatSession.resume['emergent'].total, 0);
      assert.equal(resultatSession.resume['intermediaire'].total, 1);
      assert.equal(resultatSession.resume['confirme'].total, 0);
      assert.equal(resultatSession.resume['optimal'].total, 0);
    });

    it('donne un résumé avec résultats avec, pour chaque niveau, les moyennes des réponses à chaque question', async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree({
        genere: async () => 'ABCD',
      });
      const entrepotResultatTest = new EntrepotResultatTestMemoire();
      await entrepotResultatTest.ajoute(
        resultatAvecReponses(
          {
            'prise-en-compte-risque': 1,
            pilotage: 1,
            budget: 1,
            'ressources-humaines': 4,
            'adoption-solutions': 1,
            posture: 1,
          },
          'ABCD'
        )
      );
      await entrepotResultatTest.ajoute(
        resultatAvecReponses(
          {
            'prise-en-compte-risque': 1,
            pilotage: 1,
            budget: 1,
            'ressources-humaines': 3,
            'adoption-solutions': 1,
            posture: 1,
          },
          'ABCD'
        )
      );

      const resultatSession =
        await sessionDeGroupe.resultatSession(entrepotResultatTest);

      assert.equal(resultatSession.nombreParticipants, 2);
      assert.equal(resultatSession.resume['insuffisant'].total, 2);
      assert.equal(
        resultatSession.resume['insuffisant'].moyennes['ressources-humaines'],
        3.5
      );
    });
  });
});
