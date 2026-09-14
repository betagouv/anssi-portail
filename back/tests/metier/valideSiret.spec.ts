import { describe, it, expect } from 'vitest';
import { valideSiret } from '../../src/metier/valideSiret.js';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';

describe('Valide les numéros SIRET', () => {
  it('retourne vrai pour un numéro SIRET valide', () => {
    const resultat = valideSiret(fauxAdaptateurEnvironnement, '12345678901237');

    expect(resultat).toBe(true);
  });

  it('retourne faux pour un numéro SIRET invalide', () => {
    const resultat = valideSiret(fauxAdaptateurEnvironnement, '12345678901234');

    expect(resultat).toBe(false);
  });

  it('retourne vrai si on désactive la vérification stricte', () => {
    const adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      siret: () => ({ desactiveValidationStricte: () => true }),
    };
    const resultat = valideSiret(adaptateurEnvironnement, '12345678901234');

    expect(resultat).toBe(true);
  });
});
