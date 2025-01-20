import { get, writable } from "svelte/store";
import { type ItemCyber, Typologie } from "../Catalogue.types";

const selectionDeTypologies = writable<Typologie[]>([]);

export const rechercheParTypologie = {
  subscribe: selectionDeTypologies.subscribe,
  set: selectionDeTypologies.set,
  ajouteLesRessources: () =>
    selectionDeTypologies.update((etatActuel) => [
      ...new Set([...etatActuel, Typologie.RESSOURCE]),
    ]),
  retireLesRessources: () =>
    selectionDeTypologies.update((valeur) =>
      valeur.filter((v) => v !== Typologie.RESSOURCE),
    ),
  reinitialise: () => selectionDeTypologies.set([]),
  ok: (item: ItemCyber) =>
    get(rechercheParTypologie).length === 0 ||
    get(rechercheParTypologie).includes(item.typologie),
};
