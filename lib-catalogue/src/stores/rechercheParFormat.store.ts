import { get, writable } from "svelte/store";
import { FormatRessource, type ItemCyber, Typologie } from "../Catalogue.types";

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
  ok: (item: ItemCyber) => {
    if (
      item.typologie === Typologie.SERVICE ||
      get(rechercheParFormat).length === 0
    ) {
      return true;
    }
    return !!(item.format && get(rechercheParFormat).includes(item.format));
  },
};
