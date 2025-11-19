import { derived } from 'svelte/store';
import { rechercheTextuelle } from '../rechercheTextuelle.store';
import { guidesStore } from './guides.store';
import { rechercheParCollection } from './rechercheParCollection.store';
import { rechercheParLangue } from './rechercheParLangue.store';

export const guidesFiltres = derived(
  [guidesStore, rechercheTextuelle, rechercheParLangue, rechercheParCollection],
  ([guidesStore]) => {
    const resultats = guidesStore
      .filter(rechercheTextuelle.ok)
      .filter(rechercheParCollection.ok)
      .filter(rechercheParLangue.ok);
    return { resultats };
  }
);
