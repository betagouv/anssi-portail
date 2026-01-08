import assert from 'node:assert';
import { describe, it } from 'node:test';
import { RepartitionResultatsTest } from '../../src/metier/repartitionResultatsTest';
import { ResultatTestMaturite } from '../../src/metier/resultatTestMaturite';
import { ResultatTestMaturiteCreateur } from './ResultatTestMaturiteCreateur';

describe('Les répartitions des résultats de test', () => {
  describe('Lorsque le filtre est actif', () => {
    it("calcule le ratio d'un niveau", async () => {
      const createur = new ResultatTestMaturiteCreateur();
      const resultats: ResultatTestMaturite[] = [
        ...(await createur.deNiveau('insuffisant').creePlusieurs(3)),
        await createur.deNiveau('emergent').cree(),
      ];

      const repartitions = new RepartitionResultatsTest(
        resultats
      ).calculeRepartitionParNiveau();

      assert.equal(repartitions[0].ratio, 0.75);
      assert.equal(repartitions[1].ratio, 0.25);
    });
  });
});
