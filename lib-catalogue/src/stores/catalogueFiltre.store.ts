import { derived } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { rechercheParBesoin } from "./rechercheParBesoin.store";
import { rechercheParDroitAcces } from "./rechercheParDroitAcces.store";
import { rechercheParTypologie } from "./rechercheParTypologie.store";

export const catalogueFiltre = derived(
  [
    catalogueStore,
    rechercheParBesoin,
    rechercheParDroitAcces,
    rechercheParTypologie,
  ],
  ([
    $catalogueStore,
    $rechercheParBesoin,
    $rechercheParDroitAcces,
    $rechercheParTypologie,
  ]) => ({
    resultats: $catalogueStore.filter((item) => {
      return (
        item.besoins.find(
          (b) => !$rechercheParBesoin || $rechercheParBesoin === b,
        ) &&
        item.droitsAcces.find(
          (d) =>
            $rechercheParDroitAcces.length === 0 ||
            $rechercheParDroitAcces.includes(d),
        ) &&
        ($rechercheParTypologie.length === 0 ||
          $rechercheParTypologie.includes(item.typologie))
      );
    }),
  }),
);
