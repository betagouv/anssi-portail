import { derived } from 'svelte/store';
import { guidesStore } from './guides.store';
import { rechercheParLangue } from './rechercheParLangue.store';
import { rechercheTextuelle } from './rechercheTextuelle.store';

export const guidesFiltres = derived(
  [guidesStore, rechercheTextuelle, rechercheParLangue],
  ([guidesStore]) => {
    const resultats = guidesStore
      .filter(rechercheTextuelle.ok)
      .filter(rechercheParLangue.ok);
    return { resultats };
  }
);
