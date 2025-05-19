import { describe, it } from 'node:test';
import { SessionDeGroupe } from '../../src/metier/sessionDeGroupe';
import { EntrepotResultatTestMemoire } from '../persistance/entrepotResultatTestMemoire';
import assert from 'assert';

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
  });
});
