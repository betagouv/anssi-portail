import { get, writable } from "svelte/store";
import type { BesoinCyber, ItemCyber } from "../Catalogue.types";

const selectionBesoins = writable<BesoinCyber>();

export const rechercheParBesoin = {
  subscribe: selectionBesoins.subscribe,
  set: selectionBesoins.set,
  ok: (item: ItemCyber) =>
    !!item.besoins.find(
      (b) => !get(selectionBesoins) || get(selectionBesoins) === b,
    ),
};
