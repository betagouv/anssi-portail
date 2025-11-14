import { get, writable } from 'svelte/store';
import type { Guide } from '../Catalogue.types';

const selectionDeLangue = writable<string | undefined>(undefined);

export const rechercheParLangue = {
  set: selectionDeLangue.set,
  reinitialise: () => selectionDeLangue.set(undefined),
  ok: (guide: Guide) => {
    const langue = get(selectionDeLangue);
    if (!langue) return true;
    return guide.langue === langue;
  },
};
