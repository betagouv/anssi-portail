import { get, writable } from "svelte/store";
import { type ItemCyber, Source } from "../Catalogue.types";

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
  reinitialise: () => selectionDeSources.set([]),
  ok: (item: ItemCyber) => {
    const sources = get(rechercheParSource);
    if (sources.length === 0) return true;
    if (item.sources.includes(Source.ANSSI)) {
      const secondaire = item.sources.find((s) => s !== Source.ANSSI);
      if (secondaire) {
        return sources.includes(secondaire);
      }
    }
    return !!sources.find((source) => item.sources.includes(source));
  },
};
