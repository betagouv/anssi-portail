import { writable } from "svelte/store";
import { Typologie } from "../Catalogue.types";

const selectionDeTypologies = writable<Typologie[]>([]);

export const rechercheParTypologie = {
  subscribe: selectionDeTypologies.subscribe,
  set: selectionDeTypologies.set,
  ajouteLesRessources: () => {
    selectionDeTypologies.update((etatActuel) => [
      ...new Set([...etatActuel, Typologie.RESSOURCE]),
    ]);
  },
  retireLesRessources: () => {
    selectionDeTypologies.update((valeur) =>
      valeur.filter((v) => v !== Typologie.RESSOURCE),
    );
  },
};
