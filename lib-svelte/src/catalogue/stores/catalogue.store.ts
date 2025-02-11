import { writable } from "svelte/store";
import { type ItemCyber, type RepartitionParBesoin } from "../Catalogue.types";

const { subscribe, set } = writable({
  items: [],
  repartition: {
    REAGIR: [],
    SECURISER: [],
    ETRE_SENSIBILISE: [],
    SE_FORMER: [],
  },
} as { items: ItemCyber[]; repartition: RepartitionParBesoin });

export const catalogueStore = {
  subscribe,
  initialise: (itemsCyber: ItemCyber[], repartition: RepartitionParBesoin) =>
    set({ items: [...itemsCyber], repartition }),
};
