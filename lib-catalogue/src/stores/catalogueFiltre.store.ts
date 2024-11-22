import { derived } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { rechercheParBesoin } from "./rechercheParBesoin.store";
import { rechercheParDroitAcces } from "./rechercheParDroitAcces.store";
import { rechercheParTypologie } from "./rechercheParTypologie.store";
import { rechercheParFormat } from "./rechercheParFormat.store";
import { rechercheParSource } from "./rechercheParSource.store";

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
  ]) => ({
    resultats: $catalogueStore
      .filter(rechercheParBesoin.ok)
      .filter(rechercheParDroitAcces.ok)
      .filter(rechercheParTypologie.ok)
      .filter(rechercheParFormat.ok)
      .filter(rechercheParSource.ok)
  }),
);
