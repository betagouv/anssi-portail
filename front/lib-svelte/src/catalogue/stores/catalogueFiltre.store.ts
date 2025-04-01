import { derived, get } from 'svelte/store';
import { rechercheParDroitAcces } from './rechercheParDroitAcces.store';
import { rechercheParTypologie } from './rechercheParTypologie.store';
import { rechercheParFormat } from './rechercheParFormat.store';
import { rechercheParSource } from './rechercheParSource.store';
import { limitationRecherche } from './limitationRecherche';
import { catalogueParBesoin } from './catalogueParBesoin';
import { rechercheTextuelle } from './rechercheTextuelle.store';

export const catalogueFiltre = derived(
  [
    catalogueParBesoin,
    rechercheParDroitAcces,
    rechercheParTypologie,
    rechercheParFormat,
    rechercheParSource,
    rechercheTextuelle,
  ],
  ([$catalogueParBesoin]) => {
    let resultats = $catalogueParBesoin
      .filter(rechercheParDroitAcces.ok)
      .filter(rechercheParTypologie.ok)
      .filter(rechercheParFormat.ok)
      .filter(rechercheParSource.ok)
      .filter(rechercheTextuelle.ok);
    if (get(limitationRecherche)) {
      resultats = resultats.slice(0, get(limitationRecherche));
    }
    return { resultats };
  }
);
