import { derived } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { rechercheParBesoin } from "./rechercheParBesoin.store";
import { rechercheParDroitAcces } from "./rechercheParDroitAcces.store";

export const catalogueFiltre = derived(
  [catalogueStore, rechercheParBesoin, rechercheParDroitAcces],
  ([$catalogueStore, $rechercheParBesoin, $rechercheParDroitAcces]) => {
    return {
      resultats: $catalogueStore.filter(
        (item) =>
          item.besoins.find(
            (b) => !$rechercheParBesoin || $rechercheParBesoin === b,
          ) &&
          item.droitsAcces.find(
            (d) =>
              $rechercheParDroitAcces.length === 0 ||
              $rechercheParDroitAcces.includes(d),
          ),
      ),
    };
  },
);
