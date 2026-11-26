import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { BesoinCyber, DroitAcces, Source, Typologie } from '@catalogue/Catalogue.types';
import { CollectionGuide, Langue } from '@catalogue/Guide.types';
import { rechercheParCollection } from '@catalogue/stores/guides/rechercheParCollection.store';
import { rechercheParLangue } from '@catalogue/stores/guides/rechercheParLangue.store';
import { rechercheParBesoin } from '@catalogue/stores/rechercheParBesoin.store';
import { rechercheParDroitAcces } from '@catalogue/stores/rechercheParDroitAcces.store';
import { rechercheParSource } from '@catalogue/stores/rechercheParSource.store';
import { rechercheParTypologie } from '@catalogue/stores/rechercheParTypologie.store';
import { recherches } from '@catalogue/stores/recherches.store';
import { rechercheTextuelle } from '@catalogue/stores/rechercheTextuelle.store';

describe('Le store des recherches', () => {
  beforeEach(() => {
    rechercheParDroitAcces.set([]);
    rechercheParBesoin.set(null);
    rechercheParTypologie.set([]);
    rechercheParSource.set([]);
    rechercheParLangue.set([]);
    rechercheParCollection.set([]);
    rechercheTextuelle.set('');
  });

  describe("indique qu'un filtre est actif lorsque ", () => {
    it('la recherche par besoin est active', () => {
      rechercheParBesoin.set(BesoinCyber.REAGIR);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it("la recherche par droit d'acces est active", () => {
      rechercheParDroitAcces.set([DroitAcces.ACCES_LIBRE]);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it('la recherche par typologie est active', () => {
      rechercheParTypologie.set([Typologie.SERVICE]);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it('la recherche par source est active', () => {
      rechercheParSource.set([Source.INNOVATION_ANSSI]);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it('la recherche par langue est active', () => {
      rechercheParLangue.set([Langue.FR]);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it('la recherche par collection est active', () => {
      rechercheParCollection.set([CollectionGuide.CRISE_CYBER]);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it('la recherche textuelle est active', () => {
      rechercheTextuelle.set('bonjour');

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });
  });

  it("indique lorsqu'aucun filtre n'est actif", () => {
    const { filtreActif } = get(recherches);

    expect(filtreActif).toBe(false);
  });
});
