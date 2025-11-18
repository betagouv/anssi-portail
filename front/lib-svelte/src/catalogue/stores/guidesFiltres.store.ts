import { derived } from 'svelte/store';
import { guidesStore } from './guides.store';
import { rechercheParLangue } from './rechercheParLangue.store';
import { rechercheTextuelle } from './rechercheTextuelle.store';
import { rechercheParCollection } from './rechercheParCollection.store';

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
