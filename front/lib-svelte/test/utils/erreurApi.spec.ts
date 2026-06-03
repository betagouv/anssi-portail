import { describe, expect, it } from 'vitest';
import { collecteLesErreurs } from '../../src/utils/erreurApi';

describe('La collecte des erreurs', () => {
  it('sait traiter une erreur de validation MSC', () => {
    const erreurs = collecteLesErreurs({ fieldErrors: { e: ['erreur 1', 'erreur 2'] } });

    expect(erreurs).toEqual(['erreur 1', 'erreur 2']);
  });

  it('sait traiter une erreur MAC', () => {
    const erreurMAC = { erreur: 'Aidant introuvable' };

    const erreurs = collecteLesErreurs(erreurMAC);

    expect(erreurs).toEqual(['Aidant introuvable']);
  });
});
