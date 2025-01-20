import { get, writable } from "svelte/store";
import type { DroitAcces, ItemCyber } from "../Catalogue.types";

const selectionDroitAcces = writable<DroitAcces[]>([]);

export const rechercheParDroitAcces = {
  subscribe: selectionDroitAcces.subscribe,
  set: selectionDroitAcces.set,
  reinitialise: () => selectionDroitAcces.set([]),
  ok: (item: ItemCyber) =>
    get(rechercheParDroitAcces).length === 0 ||
    !!get(rechercheParDroitAcces).find((droitAcces) =>
      item.droitsAcces.includes(droitAcces),
    ),
};
