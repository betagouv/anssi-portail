import { derived } from "svelte/store";
import { rechercheParBesoin } from "./rechercheParBesoin.store";
import { rechercheParDroitAcces } from "./rechercheParDroitAcces.store";
import { rechercheParTheme } from "./rechercheParTheme.store";
import { rechercheParTypologie } from "./rechercheParTypologie.store";
import { rechercheParFormat } from "./rechercheParFormat.store";
import { rechercheParSource } from "./rechercheParSource.store";

const recherches2 = derived(
  [
    rechercheParDroitAcces,
    rechercheParBesoin,
    rechercheParTheme,
    rechercheParTypologie,
    rechercheParFormat,
    rechercheParSource,
  ],
  ([
    $rechercheParDroitAcces,
    $rechercheParBesoin,
    $rechercheParTheme,
    $rechercheParTypologie,
    $rechercheParFormat,
    $rechercheParSource,
  ]) => ({
    filtreActif:
      $rechercheParDroitAcces.length !== 0 ||
      !!$rechercheParBesoin ||
      $rechercheParTheme.length !== 0 ||
      $rechercheParTypologie.length !== 0 ||
      $rechercheParFormat.length !== 0 ||
      $rechercheParSource.length !== 0,
  }),
);

export const recherches = {
  subscribe: recherches2.subscribe,
  reinitialise: () => {
    rechercheParBesoin.reinitialise();
    rechercheParDroitAcces.reinitialise();
    rechercheParTypologie.reinitialise();
    rechercheParFormat.reinitialise();
    rechercheParSource.reinitialise();
    rechercheParTheme.reinitialise();
  },
};
