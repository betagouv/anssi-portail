import { derived } from 'svelte/store';
import { rechercheTextuelle } from '../rechercheTextuelle.store';
import { guidesStore } from './guides.store';
import { rechercheParCollection } from './rechercheParCollection.store';
import { rechercheParLangue } from './rechercheParLangue.store';
import { rechercheParBesoin } from '../rechercheParBesoin.store';

export const guidesFiltres = derived(
  [
    guidesStore,
    rechercheTextuelle,
    rechercheParLangue,
    rechercheParCollection,
    rechercheParBesoin,
  ],
  ([guidesStore]) => {
    const resultats = guidesStore
      .filter(rechercheTextuelle.ok)
      .filter(rechercheParCollection.ok)
      .filter(rechercheParLangue.ok)
      .filter(rechercheParBesoin.ok);
    return { resultats };
  }
);
