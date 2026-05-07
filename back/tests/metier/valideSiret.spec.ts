import assert from 'node:assert';
import { describe, it } from 'node:test';
import { valideSiret } from '../../src/metier/valideSiret';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets';

describe('Valide les numéros SIRET', () => {
  it('retourne vrai pour un numéro SIRET valide', () => {
    const resultat = valideSiret(fauxAdaptateurEnvironnement, '12345678901237');

    assert.strictEqual(resultat, true);
  });

  it('retourne faux pour un numéro SIRET invalide', () => {
    const resultat = valideSiret(fauxAdaptateurEnvironnement, '12345678901234');

    assert.strictEqual(resultat, false);
  });

  it('retourne vrai si on désactive la vérification stricte', () => {
    const adaptateurEnvironnement = {
      ...fauxAdaptateurEnvironnement,
      siret: () => ({ desactiveValidationStricte: () => true }),
    };
    const resultat = valideSiret(adaptateurEnvironnement, '12345678901234');

    assert.strictEqual(resultat, true);
  });
});
