import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  BesoinCyber,
  CollectionGuide,
  DroitAcces,
  FormatRessource,
  Langue,
  Source,
  Typologie,
} from '../../../src/catalogue/Catalogue.types';
import { rechercheParCollection } from '../../../src/catalogue/stores/guides/rechercheParCollection.store';
import { rechercheParLangue } from '../../../src/catalogue/stores/guides/rechercheParLangue.store';
import { rechercheParBesoin } from '../../../src/catalogue/stores/rechercheParBesoin.store';
import { rechercheParDroitAcces } from '../../../src/catalogue/stores/rechercheParDroitAcces.store';
import { rechercheParFormat } from '../../../src/catalogue/stores/rechercheParFormat.store';
import { rechercheParSource } from '../../../src/catalogue/stores/rechercheParSource.store';
import { rechercheParTypologie } from '../../../src/catalogue/stores/rechercheParTypologie.store';
import { recherches } from '../../../src/catalogue/stores/recherches.store';

describe('Le store des recherches', () => {
  beforeEach(() => {
    rechercheParDroitAcces.set([]);
    rechercheParBesoin.set(null);
    rechercheParFormat.set([]);
    rechercheParTypologie.set([]);
    rechercheParSource.set([]);
    rechercheParLangue.set([]);
    rechercheParCollection.set([]);
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

    it('la recherche par format est active', () => {
      rechercheParFormat.set([FormatRessource.PUBLICATION]);

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
  });

  it("indique lorsqu'aucun filtre n'est actif", () => {
    const { filtreActif } = get(recherches);

    expect(filtreActif).toBe(false);
  });
});
