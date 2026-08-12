import { describe, expect, it } from 'vitest';
import { calculeIdNiveau } from '../../src/niveaux-maturite/calculeIdNiveau';

describe('Le calcul du niveau de maturité', () => {
  it.each([
    [0, 'insuffisant'],
    [1, 'emergent'],
    [2, 'intermediaire'],
    [3, 'confirme'],
    [4, 'optimal'],
  ] as const)('associe la moyenne %s au niveau %s', (moyenne, niveau) => {
    expect(calculeIdNiveau(moyenne)).toBe(niveau);
  });
});
