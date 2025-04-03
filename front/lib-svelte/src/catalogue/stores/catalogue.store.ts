import { writable } from 'svelte/store';
import { type ItemCyber, type RepartitionParBesoin } from '../Catalogue.types';

const repartitionVide = {
  REAGIR: [],
  SECURISER: [],
  SE_FORMER: [],
  ETRE_SENSIBILISE: [],
  TOUS: [],
};

const { subscribe, set } = writable({
  items: [],
  repartition: repartitionVide,
} as { items: ItemCyber[]; repartition: RepartitionParBesoin });

export const catalogueStore = {
  subscribe,
  initialise: (itemsCyber: ItemCyber[], repartition?: RepartitionParBesoin) => {
    set({
      items: [...itemsCyber],
      repartition: repartition ?? repartitionVide,
    });
  },
};
