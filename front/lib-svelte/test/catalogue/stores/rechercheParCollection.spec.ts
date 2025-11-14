import { describe, expect, it } from 'vitest';
import type { Guide } from '../../../src/catalogue/Catalogue.types';
import { rechercheParCollection } from '../../../src/catalogue/stores/rechercheParCollection.store';

const guideZeroTrust: Guide = {
  id: 'zero-trust',
  titre: 'Zero Trust',
  lienVignette:
    'https://cyber.gouv.fr/sites/default/files/image/anssi-fondamentaux-zero-trust-v1_publication.jpg',
  langue: 'FR',
  collections: ['Les essentiels'],
};

describe('La recherche par collection', () => {
  it('retourne vrai lorsque la collection du filtre correspond à la collection du guide', () => {
    rechercheParCollection.set(['Les essentiels']);

    const resultat = rechercheParCollection.ok(guideZeroTrust);

    expect(resultat).toBe(true);
  });

  it('retourne faux lorsque la collection du filtre ne correspond pas à la collection du guide', () => {
    rechercheParCollection.set(['Autre collection']);

    const resultat = rechercheParCollection.ok(guideZeroTrust);

    expect(resultat).toBe(false);
  });

  it('retourne vrai quand on la réinitialise', () => {
    rechercheParCollection.set(['Autre collection']);

    rechercheParCollection.reinitialise();

    const resultat = rechercheParCollection.ok(guideZeroTrust);
    expect(resultat).toBe(true);
  });

  it("retourne vrai lorsque plusieurs collections sont sélectionnées et qu'une correspond", () => {
    rechercheParCollection.set(['Autre collection', 'Les essentiels']);

    const resultat = rechercheParCollection.ok(guideZeroTrust);

    expect(resultat).toBe(true);
  });
});
