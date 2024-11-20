import { writable } from "svelte/store";
import { FormatRessource } from "../Catalogue.types";

const selectionDeFormats = writable<FormatRessource[]>([]);

export const rechercheParFormat = {
  ...selectionDeFormats,
  subscribe: selectionDeFormats.subscribe,
  ajouteTous: () =>
    selectionDeFormats.update(() => [
      FormatRessource.PDF,
      FormatRessource.LISTES,
      FormatRessource.VIDEO,
    ]),
  retireTous: () => selectionDeFormats.update(() => []),
};
