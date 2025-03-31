import { describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { catalogueStore } from '../../../src/catalogue/stores/catalogue.store';
import { livretEnJeux, mss } from './objetsExemples';
import { ItemCyber } from '../../../src/catalogue/Catalogue.types';

describe('Le store du catalogue', () => {
  it("est une collection d'items", () => {
    const store = get(catalogueStore);

    expect(store.items.length).toBe(0);
  });

  const initialiseStoreCatalogue = (tous: ItemCyber[]) => {
    catalogueStore.initialise(tous, {
      REAGIR: [],
      SE_FORMER: [],
      SECURISER: [],
      ETRE_SENSIBILISE: [],
      TOUS: tous.map((item) => item.id),
    });
  };
  const repartitionVide = () => ({
    REAGIR: [],
    SE_FORMER: [],
    SECURISER: [],
    ETRE_SENSIBILISE: [],
  });

  it('peut être initialisé avec des services', () => {
    initialiseStoreCatalogue([mss()]);

    expect(get(catalogueStore).items.length).toBe(1);
    expect(get(catalogueStore).items[0].nom).toBe('mss');
  });

  it('peut être initialisé avec des ressources', () => {
    initialiseStoreCatalogue([livretEnJeux()]);

    expect(get(catalogueStore).items.length).toBe(1);
    expect(get(catalogueStore).items[0].nom).toBe('enjeux');
  });
});
