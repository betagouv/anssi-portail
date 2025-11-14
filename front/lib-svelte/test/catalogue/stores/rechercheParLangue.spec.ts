import { describe, expect, it } from 'vitest';
import { rechercheParLangue } from '../../../src/catalogue/stores/rechercheParLangue.store';
import { guideZeroTrust } from './objetsExemples';

describe('La recherche par langue', () => {
  it('retourne vrai lorsque la langue du filtre correspond à la langue du guide', () => {
    rechercheParLangue.set('FR');

    const resultat = rechercheParLangue.ok(guideZeroTrust);

    expect(resultat).toBe(true);
  });

  it('retourne faux lorsque la langue du filtre ne correspond pas à la langue du guide', () => {
    rechercheParLangue.set('EN');

    const resultat = rechercheParLangue.ok(guideZeroTrust);

    expect(resultat).toBe(false);
  });

  it('retourne vrai quand on la réinitialise', () => {
    rechercheParLangue.set('EN');

    rechercheParLangue.reinitialise();

    const resultat = rechercheParLangue.ok(guideZeroTrust);
    expect(resultat).toBe(true);
  });
});
