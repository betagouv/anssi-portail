import { get, writable } from 'svelte/store';
import type { Guide, Langue } from '../Catalogue.types';

const selectionDeLangue = writable<Langue | undefined>();

export const rechercheParLangue = {
  ...selectionDeLangue,
  reinitialise: () => selectionDeLangue.set(undefined),
  ok: (guide: Guide) => {
    const langue = get(selectionDeLangue);
    if (!langue) return true;
    return guide.langue === langue;
  },
};
