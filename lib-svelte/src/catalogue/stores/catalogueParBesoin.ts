import { derived } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { rechercheParBesoin } from "./rechercheParBesoin.store";

export const catalogueParBesoin = derived(
  [catalogueStore, rechercheParBesoin],
  ([$catalogueStore, $rechercheParBesoin]) => {
    if (!$rechercheParBesoin) {
      return $catalogueStore.items;
    }

    return $catalogueStore.repartition[$rechercheParBesoin]
      .map((id) => $catalogueStore.items.find((i) => i.id === id))
      .filter((i) => i !== undefined);
  },
);
