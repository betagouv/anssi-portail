import { get, writable } from "svelte/store";
import type { BesoinCyber, ItemCyber } from "../Catalogue.types";

const selectionBesoins = writable<BesoinCyber | null>();

export const rechercheParBesoin = {
  subscribe: selectionBesoins.subscribe,
  set: selectionBesoins.set,
  reinitialise: () => selectionBesoins.set(null),
  ok: (item: ItemCyber) =>
    item.besoins && !!item.besoins.find(
      (b) => !get(selectionBesoins) || get(selectionBesoins) === b,
    ),
};
