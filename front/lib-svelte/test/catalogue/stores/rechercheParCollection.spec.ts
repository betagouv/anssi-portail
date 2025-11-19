import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { type Guide } from '../../../src/catalogue/Guide.types';
import { CollectionGuide } from '../../../src/catalogue/Guide.types';
import { rechercheParCollection } from '../../../src/catalogue/stores/guides/rechercheParCollection.store';

const guideZeroTrust: Guide = {
  type: 'Guide',
  id: 'zero-trust',
  nom: 'Zero Trust',
  resume: 'Les fondamentaux du modèle Zero Trust',
  description:
    "Les fondamentaux du modèle Zero Trust pour sécuriser les systèmes d'information",
  illustration:
    'https://cyber.gouv.fr/sites/default/files/image/anssi-fondamentaux-zero-trust-v1_publication.jpg',
  langue: 'FR',
  collections: ['Les essentiels'],
};

describe('La recherche par collection', () => {
  it('retourne vrai lorsque la collection du filtre correspond à la collection du guide', () => {
    rechercheParCollection.set([CollectionGuide.LES_ESSENTIELS]);

    const resultat = rechercheParCollection.ok(guideZeroTrust);

    expect(resultat).toBe(true);
  });

  it('retourne faux lorsque la collection du filtre ne correspond pas à la collection du guide', () => {
    rechercheParCollection.set([CollectionGuide.CRISE_CYBER]);

    const resultat = rechercheParCollection.ok(guideZeroTrust);

    expect(resultat).toBe(false);
  });

  it('retourne vrai quand on la réinitialise', () => {
    rechercheParCollection.set([CollectionGuide.CRISE_CYBER]);

    rechercheParCollection.reinitialise();

    const resultat = rechercheParCollection.ok(guideZeroTrust);
    expect(resultat).toBe(true);
  });

  it("retourne vrai lorsque plusieurs collections sont sélectionnées et qu'une correspond", () => {
    rechercheParCollection.set([
      CollectionGuide.CRISE_CYBER,
      CollectionGuide.LES_ESSENTIELS,
    ]);

    const resultat = rechercheParCollection.ok(guideZeroTrust);

    expect(resultat).toBe(true);
  });

  it('ajoute une liste de collection à la liste existante sans doublon', () => {
    rechercheParCollection.set([
      CollectionGuide.CRISE_CYBER,
      CollectionGuide.LES_ESSENTIELS,
    ]);

    rechercheParCollection.ajoute([
      CollectionGuide.CRISE_CYBER,
      CollectionGuide.LES_FONDAMENTAUX,
    ]);

    expect(get(rechercheParCollection)).toEqual([
      CollectionGuide.CRISE_CYBER,
      CollectionGuide.LES_ESSENTIELS,
      CollectionGuide.LES_FONDAMENTAUX,
    ]);
  });

  it('retire une liste de collection à la liste existante si les items existent', () => {
    rechercheParCollection.set([
      CollectionGuide.CRISE_CYBER,
      CollectionGuide.LES_ESSENTIELS,
    ]);

    rechercheParCollection.retire([
      CollectionGuide.CRISE_CYBER,
      CollectionGuide.LES_FONDAMENTAUX,
    ]);

    expect(get(rechercheParCollection)).toEqual([
      CollectionGuide.LES_ESSENTIELS,
    ]);
  });
});
