import { get, writable } from 'svelte/store';
import { CollectionGuide, type Guide } from '../../Catalogue.types';

const selectionDeCollection = writable<CollectionGuide[]>([]);

export const rechercheParCollection = {
  set: selectionDeCollection.set,
  subscribe: selectionDeCollection.subscribe,
  reinitialise: () => selectionDeCollection.set([]),
  ajoute: (collectionsAdditionnelles: CollectionGuide[]) => {
    const collections = get(selectionDeCollection);
    if (
      collections.length > 0 &&
      collections.every((collection) =>
        collectionsAdditionnelles.includes(collection)
      )
    ) {
      return;
    }
    const collectionsUniques = [
      ...new Set(collections.concat(collectionsAdditionnelles)),
    ];
    selectionDeCollection.set(collectionsUniques);
  },
  retire: (collectionsARetire: CollectionGuide[]) => {
    const collections = get(selectionDeCollection);
    if (
      collections.some((collection) => collectionsARetire.includes(collection))
    ) {
      selectionDeCollection.set(
        collections.filter(
          (collection) => !collectionsARetire.includes(collection)
        )
      );
    }
  },
  ok: (guide: Guide) => {
    const collections = get(selectionDeCollection);
    if (collections.length === 0) return true;
    return collections.some((collection) =>
      guide.collections.includes(collection)
    );
  },
};
