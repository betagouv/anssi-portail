import { derived } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { rechercheParBesoin } from "./rechercheParBesoin.store";
import { rechercheParDroitAcces } from "./rechercheParDroitAcces.store";
import { rechercheParTypologie } from "./rechercheParTypologie.store";
import { rechercheParFormat } from "./rechercheParFormat.store";
import { type ItemCyber, Typologie } from "../Catalogue.types";

export const catalogueFiltre = derived(
  [
    catalogueStore,
    rechercheParBesoin,
    rechercheParDroitAcces,
    rechercheParTypologie,
    rechercheParFormat,
  ],
  ([
    $catalogueStore,
    $rechercheParBesoin,
    $rechercheParDroitAcces,
    $rechercheParTypologie,
    $rechercheParFormat,
  ]) => {
    const formatOk = (item: ItemCyber) => {
      if (
        item.typologie === Typologie.SERVICE ||
        $rechercheParFormat.length === 0
      ) {
        return true;
      }

      return item.format && $rechercheParFormat.includes(item.format);
    };
    return {
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
            $rechercheParTypologie.includes(item.typologie)) &&
          formatOk(item)
        );
      }),
    };
  },
);
