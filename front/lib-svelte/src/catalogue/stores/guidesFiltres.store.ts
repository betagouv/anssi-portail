import { derived, get } from 'svelte/store';
import { guidesStore } from './guides.store';
import { rechercheTextuelle } from './rechercheTextuelle.store';
import { rechercheParLangue } from './rechercheParLangue.store';

export const guidesFiltres = derived([guidesStore], () => {
  const resultats = get(guidesStore)
    .filter(rechercheTextuelle.ok)
    .filter(rechercheParLangue.ok);
  return { resultats };
});
