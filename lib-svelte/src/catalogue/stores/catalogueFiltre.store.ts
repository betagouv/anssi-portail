import { derived, get } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { rechercheParBesoin } from "./rechercheParBesoin.store";
import { rechercheParDroitAcces } from "./rechercheParDroitAcces.store";
import { rechercheParTypologie } from "./rechercheParTypologie.store";
import { rechercheParFormat } from "./rechercheParFormat.store";
import { rechercheParSource } from "./rechercheParSource.store";
import { limitationRecherche } from "./limitationRecherche";
import type { ItemCyber } from "../Catalogue.types";

export const catalogueFiltre = derived(
  [
    catalogueStore,
    rechercheParBesoin,
    rechercheParDroitAcces,
    rechercheParTypologie,
    rechercheParFormat,
    rechercheParSource,
  ],
  ([
    $catalogueStore,
    $rechercheParBesoin,
    $rechercheParDroitAcces,
    $rechercheParTypologie,
    $rechercheParFormat,
    $rechercheParSource,
  ]) => {
    let itemsDuBesoin: ItemCyber[] = [];
    let besoin = get(rechercheParBesoin);
    if (besoin) {
      itemsDuBesoin = $catalogueStore.repartition[besoin]
        .map((id) => $catalogueStore.items.find((i) => i.id === id))
        .filter((i) => i !== undefined);
    } else itemsDuBesoin = $catalogueStore.items;
    let resultats = itemsDuBesoin
      .filter(rechercheParDroitAcces.ok)
      .filter(rechercheParTypologie.ok)
      .filter(rechercheParFormat.ok)
      .filter(rechercheParSource.ok);
    if (get(limitationRecherche)) {
      resultats = resultats.slice(0, get(limitationRecherche));
    }
    return { resultats };
  },
);
