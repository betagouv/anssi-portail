import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';

import { BesoinCyber } from '@catalogue/Catalogue.types';
import { CollectionGuide, Langue } from '@catalogue/Guide.types';
import { guidesStore } from '@catalogue/stores/guides/guides.store';
import { guidesFiltres } from '@catalogue/stores/guides/guidesFiltres.store';
import { rechercheParCollection } from '@catalogue/stores/guides/rechercheParCollection.store';
import { rechercheParLangue } from '@catalogue/stores/guides/rechercheParLangue.store';
import { rechercheParBesoin } from '@catalogue/stores/rechercheParBesoin.store';
import { rechercheTextuelle } from '@catalogue/stores/rechercheTextuelle.store';

import { guideDevsecops, guideDevsecopsEN, guideZeroTrust } from './objetsExemples';

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

      expect(resultats.length).toBe(2);
      expect(resultats[0].nom).toBe('Zero Trust');
    });

    it("conserve tous les items en cas d'absence de collection", () => {
      rechercheParCollection.set([]);

      const { resultats } = get(guidesFiltres);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre de besoin", () => {
    it('conserve uniquement les items correspondants', () => {
      guidesStore.initialise([guideZeroTrust, guideDevsecopsEN]);
      rechercheParBesoin.set(BesoinCyber.SE_FORMER);

      const { resultats } = get(guidesFiltres);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('Zero Trust');
    });
  });
});
