import { beforeEach, describe, expect, it } from 'vitest';
import { rechercheTextuelle } from '../../../src/catalogue/stores/rechercheTextuelle.store';
import { get } from 'svelte/store';
import { guidesStore } from '../../../src/catalogue/stores/guides.store';
import {
  guideDevsecops,
  guideDevsecopsEN,
  guideZeroTrust,
} from './objetsExemples';
import { guidesFiltres } from '../../../src/catalogue/stores/guidesFiltres.store';
import { rechercheParLangue } from '../../../src/catalogue/stores/rechercheParLangue.store';
import {
  CollectionGuide,
  Langue,
} from '../../../src/catalogue/Catalogue.types';
import { rechercheParCollection } from '../../../src/catalogue/stores/rechercheParCollection.store';

describe('Le store des guides filtrés', () => {
  beforeEach(() => {
    rechercheTextuelle.reinitialise();
    rechercheParLangue.reinitialise();
    rechercheParCollection.reinitialise();
    guidesStore.initialise([guideZeroTrust, guideDevsecops]);
  });

  describe('sur recherche textuelle', () => {
    it("filtre sur le nom de l'item", () => {
      rechercheTextuelle.set('Zero Trust');

      const { resultats } = get(guidesFiltres);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('Zero Trust');
    });

    it('le filtre sur le nom peut être partiel', () => {
      rechercheTextuelle.set('Zero');

      const { resultats } = get(guidesFiltres);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('Zero Trust');
    });

    it('le filtre est insensible à la casse', () => {
      rechercheTextuelle.set('zero trust');

      const { resultats } = get(guidesFiltres);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('Zero Trust');
    });

    it('filtre sur la description', () => {
      rechercheTextuelle.set('sécuriser');

      const { resultats } = get(guidesFiltres);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('Zero Trust');
    });
  });

  describe("sur application d'un filtre de langue", () => {
    // d'autres tests plus spécifiques sont dans rechercheParLangue.store.spec
    it('conserve uniquement les items correspondants', () => {
      guidesStore.initialise([guideZeroTrust, guideDevsecopsEN]);
      rechercheParLangue.set([Langue.FR]);

      const { resultats } = get(guidesFiltres);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('Zero Trust');
    });

    it("conserve tous les items en cas d'absence de langue", () => {
      rechercheParLangue.set([]);

      const { resultats } = get(guidesFiltres);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre de collection", () => {
    it('conserve uniquement les items correspondants', () => {
      guidesStore.initialise([guideZeroTrust, guideDevsecopsEN]);
      rechercheParCollection.set([CollectionGuide.LES_ESSENTIELS]);

      const { resultats } = get(guidesFiltres);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('Zero Trust');
    });

    it("conserve tous les items en cas d'absence de collection", () => {
      rechercheParCollection.set([]);

      const { resultats } = get(guidesFiltres);

      expect(resultats.length).toBe(2);
    });
  });
});
