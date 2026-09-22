import { derived, get } from 'svelte/store';
import { catalogueParBesoin } from './catalogueParBesoin';
import { limitationRecherche } from './limitationRecherche';
import { rechercheParDroitAcces } from './rechercheParDroitAcces.store';
import { rechercheParSource } from './rechercheParSource.store';
import { rechercheParTypologie } from './rechercheParTypologie.store';
import { rechercheTextuelle } from './rechercheTextuelle.store';

export const catalogueFiltre = derived(
  [catalogueParBesoin, rechercheParDroitAcces, rechercheParTypologie, rechercheParSource, rechercheTextuelle],
  ([$catalogueParBesoin]) => {
    let resultats = $catalogueParBesoin
      .filter(rechercheParDroitAcces.ok)
      .filter(rechercheParTypologie.ok)
      .filter(rechercheParSource.ok)
      .filter(rechercheTextuelle.ok);
    if (get(limitationRecherche)) {
      resultats = resultats.slice(0, get(limitationRecherche));
    }
    return { resultats };
  }
);
