import { describe, expect, it } from 'vitest';
import { Langue } from '../../../src/catalogue/Guide.types';
import { rechercheParLangue } from '../../../src/catalogue/stores/guides/rechercheParLangue.store';
import { guideZeroTrust } from './objetsExemples';

describe('La recherche par langue', () => {
  it('retourne vrai lorsque la langue du filtre correspond à la langue du guide', () => {
    rechercheParLangue.set([Langue.FR]);

    const resultat = rechercheParLangue.ok(guideZeroTrust);

    expect(resultat).toBe(true);
  });

  it("retourne vrai lorsqu'au moins une langue du filtre correspond à la langue du guide", () => {
    rechercheParLangue.set([Langue.EN, Langue.FR]);

    const resultat = rechercheParLangue.ok(guideZeroTrust);

    expect(resultat).toBe(true);
  });

  it('retourne faux lorsque la langue du filtre ne correspond pas à la langue du guide', () => {
    rechercheParLangue.set([Langue.EN]);

    const resultat = rechercheParLangue.ok(guideZeroTrust);

    expect(resultat).toBe(false);
  });

  it('retourne vrai quand on la réinitialise', () => {
    rechercheParLangue.set([Langue.EN]);

    rechercheParLangue.reinitialise();

    const resultat = rechercheParLangue.ok(guideZeroTrust);
    expect(resultat).toBe(true);
  });
});
