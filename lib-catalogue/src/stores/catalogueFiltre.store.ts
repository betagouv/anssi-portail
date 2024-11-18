import { derived } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { rechercheParBesoin } from "./rechercheParBesoin.store";

export const catalogueFiltre = derived(
  [catalogueStore, rechercheParBesoin],
  ([$catalogueStore, $rechercheParBesoin]) => {
    return {
      resultats: $catalogueStore.filter((item) =>
        item.besoins.find(
          (b) => !$rechercheParBesoin || $rechercheParBesoin === b,
        ),
      ),
    };
  },
);
