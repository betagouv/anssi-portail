import { get, writable } from 'svelte/store';
import type { Guide, Langue } from '../../Catalogue.types';

const selectionDeLangue = writable<Langue[]>([]);

export const rechercheParLangue = {
  subscribe: selectionDeLangue.subscribe,
  set: selectionDeLangue.set,
  reinitialise: () => selectionDeLangue.set([]),
  ok: (guide: Guide) => {
    const langues = get(selectionDeLangue);
    if (!langues.length) return true;
    return langues.some((langue) => langue.valueOf() === guide.langue);
  },
};
