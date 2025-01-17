import { derived, get } from "svelte/store";
import { catalogueStore } from "./catalogue.store";
import { rechercheParBesoin } from "./rechercheParBesoin.store";
import { rechercheParDroitAcces } from "./rechercheParDroitAcces.store";
import { rechercheParTypologie } from "./rechercheParTypologie.store";
import { rechercheParFormat } from "./rechercheParFormat.store";
import { rechercheParSource } from "./rechercheParSource.store";
import { rechercheParTheme } from "./rechercheParTheme.store";
import { limitationRecherche } from "./limitationRecherche";

export const catalogueFiltre = derived(
  [
    catalogueStore,
    rechercheParBesoin,
    rechercheParDroitAcces,
    rechercheParTypologie,
    rechercheParFormat,
    rechercheParSource,
    rechercheParTheme,
  ],
  ([
    $catalogueStore,
    $rechercheParBesoin,
    $rechercheParDroitAcces,
    $rechercheParTypologie,
    $rechercheParFormat,
    $rechercheParSource,
    $rechercheParTheme,
  ]) => {
    let resultats = $catalogueStore
      .filter(rechercheParBesoin.ok)
      .filter(rechercheParDroitAcces.ok)
      .filter(rechercheParTypologie.ok)
      .filter(rechercheParFormat.ok)
      .filter(rechercheParSource.ok)
      .filter(rechercheParTheme.ok);
    if (get(limitationRecherche)) {
      resultats = resultats.slice(0, get(limitationRecherche));
    }
    return { resultats };
  },
);
