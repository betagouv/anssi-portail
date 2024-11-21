import { get, writable } from "svelte/store";
import { type ItemCyber, Source, Typologie } from "../Catalogue.types";

const selectionDeSources = writable<Source[]>([]);

export const rechercheParSource = {
  subscribe: selectionDeSources.subscribe,
  set: selectionDeSources.set,
  ajoute: (source: Source) =>
    selectionDeSources.update((etatActuel) => [
      ...new Set([...etatActuel, source]),
    ]),
  retire: (source: Source) =>
    selectionDeSources.update((valeur) => valeur.filter((v) => v !== source)),
};
