import { derived, get } from "svelte/store";
import { rechercheParDroitAcces } from "./rechercheParDroitAcces.store";
import { rechercheParTypologie } from "./rechercheParTypologie.store";
import { rechercheParFormat } from "./rechercheParFormat.store";
import { rechercheParSource } from "./rechercheParSource.store";
import { limitationRecherche } from "./limitationRecherche";
import { catalogueParBesoin } from "./catalogueParBesoin";

export const catalogueFiltre = derived(
  [
    catalogueParBesoin,
    rechercheParDroitAcces,
    rechercheParTypologie,
    rechercheParFormat,
    rechercheParSource,
  ],
  ([
    $catalogueParBesoin,
    $rechercheParDroitAcces,
    $rechercheParTypologie,
    $rechercheParFormat,
    $rechercheParSource,
  ]) => {
    let resultats = $catalogueParBesoin
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
