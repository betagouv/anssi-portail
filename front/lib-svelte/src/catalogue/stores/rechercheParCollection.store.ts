import { get, writable } from 'svelte/store';
import type { Guide } from '../Catalogue.types';

const selectionDeCollection = writable<string[]>([]);

export const rechercheParCollection = {
  set: selectionDeCollection.set,
  reinitialise: () => selectionDeCollection.set([]),
  ok: (guide: Guide) => {
    const collections = get(selectionDeCollection);
    if (collections.length === 0) return true;
    return collections.some((collection) =>
      guide.collections.includes(collection)
    );
  },
};
