import { get, writable } from 'svelte/store';
import type { CollectionGuide, Guide } from '../Catalogue.types';

const selectionDeCollection = writable<CollectionGuide[]>([]);

export const rechercheParCollection = {
  set: selectionDeCollection.set,
  subscribe: selectionDeCollection.subscribe,
  reinitialise: () => selectionDeCollection.set([]),
  ok: (guide: Guide) => {
    const collections = get(selectionDeCollection);
    if (collections.length === 0) return true;
    return collections.some((collection) =>
      guide.collections.includes(collection)
    );
  },
};
