import { describe, expect, it } from 'vitest';

import { SessionDeGroupe } from '@metier/mini-tests/maturite-cyber/sessionDeGroupe.js';

import { unRésultatDeTestDeMaturité } from '../../../api/mini-tests/maturite-cyber/constructeurResultatTestMaturite.js';
import { EntrepôtRésultatTestMaturitéMémoire } from '../../../persistance/entrepotResultatTestMaturiteMemoire.js';

describe('La session de groupe', () => {
  describe('sur demande des résultats', () => {
    it('donne un résumé sans résultat', async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree({
        genere: async () => 'ABCD',
      });
      const entrepotResultatTest = new EntrepôtRésultatTestMaturitéMémoire();

      const resultatSession = await sessionDeGroupe.resultatSession(entrepotResultatTest);

      expect(resultatSession.nombreParticipants).toBe(0);
      expect(resultatSession.resume['insuffisant'].total).toBe(0);
      expect(resultatSession.resume['emergent'].total).toBe(0);
      expect(resultatSession.resume['intermediaire'].total).toBe(0);
      expect(resultatSession.resume['confirme'].total).toBe(0);
      expect(resultatSession.resume['optimal'].total).toBe(0);
      const moyennesAZero = {
        'prise-en-compte-risque': 0,
        pilotage: 0,
        budget: 0,
        'ressources-humaines': 0,
        'adoption-solutions': 0,
        posture: 0,
      };
      expect(resultatSession.resume['insuffisant'].moyennes).toEqual(moyennesAZero);
      expect(resultatSession.resume['emergent'].moyennes).toEqual(moyennesAZero);
      expect(resultatSession.resume['intermediaire'].moyennes).toEqual(moyennesAZero);
      expect(resultatSession.resume['confirme'].moyennes).toEqual(moyennesAZero);
      expect(resultatSession.resume['optimal'].moyennes).toEqual(moyennesAZero);
    });

    it('donne un résumé avec résultats avec les totaux de participant par niveau', async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree({
        genere: async () => 'ABCD',
      });
      const entrepotResultatTest = new EntrepôtRésultatTestMaturitéMémoire();
      await entrepotResultatTest.ajoute(
        await unRésultatDeTestDeMaturité()
          .avecRéponses({
            'prise-en-compte-risque': 3,
            pilotage: 3,
            budget: 3,
            'ressources-humaines': 4,
            'adoption-solutions': 4,
            posture: 4,
          })
          .avecCodeSessionGroupe('ABCD')
          .construis()
      );
      await entrepotResultatTest.ajoute(
        await unRésultatDeTestDeMaturité()
          .avecRéponses({
            'prise-en-compte-risque': 1,
            pilotage: 1,
            budget: 1,
            'ressources-humaines': 1,
            'adoption-solutions': 1,
            posture: 1,
          })
          .avecCodeSessionGroupe('ABCD')
          .construis()
      );

      const resultatSession = await sessionDeGroupe.resultatSession(entrepotResultatTest);

      expect(resultatSession.nombreParticipants).toBe(2);
      expect(resultatSession.resume['insuffisant'].total).toBe(1);
      expect(resultatSession.resume['emergent'].total).toBe(0);
      expect(resultatSession.resume['intermediaire'].total).toBe(1);
      expect(resultatSession.resume['confirme'].total).toBe(0);
      expect(resultatSession.resume['optimal'].total).toBe(0);
    });

    it('donne un résumé avec résultats avec, pour chaque niveau, les moyennes des réponses à chaque question', async () => {
      const sessionDeGroupe = await SessionDeGroupe.cree({
        genere: async () => 'ABCD',
      });
      const entrepotResultatTest = new EntrepôtRésultatTestMaturitéMémoire();

      await entrepotResultatTest.ajoute(
        await unRésultatDeTestDeMaturité()
          .avecRéponses({
            'prise-en-compte-risque': 1,
            pilotage: 1,
            budget: 1,
            'ressources-humaines': 4,
            'adoption-solutions': 1,
            posture: 1,
          })
          .avecCodeSessionGroupe('ABCD')
          .construis()
      );
      await entrepotResultatTest.ajoute(
        await unRésultatDeTestDeMaturité()
          .avecRéponses({
            'prise-en-compte-risque': 1,
            pilotage: 1,
            budget: 1,
            'ressources-humaines': 3,
            'adoption-solutions': 1,
            posture: 1,
          })
          .avecCodeSessionGroupe('ABCD')
          .construis()
      );

      const resultatSession = await sessionDeGroupe.resultatSession(entrepotResultatTest);

      expect(resultatSession.nombreParticipants).toBe(2);
      expect(resultatSession.resume['insuffisant'].total).toBe(2);
      expect(resultatSession.resume['insuffisant'].moyennes['ressources-humaines']).toBe(3.5);
    });
  });
});
