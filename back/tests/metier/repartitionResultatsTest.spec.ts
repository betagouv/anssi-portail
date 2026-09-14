import { describe, it, expect } from 'vitest';
import { RepartitionResultatsTest } from '../../src/metier/repartitionResultatsTest.js';
import { ResultatTestMaturite } from '../../src/metier/resultatTestMaturite.js';
import { ResultatTestMaturiteCreateur } from './ResultatTestMaturiteCreateur.js';

describe('Les répartitions des résultats de test', () => {
  describe('Lorsque le filtre est actif', () => {
    it("calcule le ratio d'un niveau", async () => {
      const createur = new ResultatTestMaturiteCreateur();
      const resultats: ResultatTestMaturite[] = [
        ...(await createur.deNiveau('insuffisant').creePlusieurs(3)),
        await createur.deNiveau('emergent').cree(),
      ];

      const repartitions = new RepartitionResultatsTest(resultats).calculeRepartitionParNiveau();

      expect(repartitions[0].ratio).toBe(0.75);
      expect(repartitions[1].ratio).toBe(0.25);
    });
  });
});
