import { derived } from 'svelte/store';
import { CollectionGuide, Langue } from '../../Catalogue.types';
import { guidesStore } from './guides.store';

type NombreResultats = {
  parLangue: Partial<Record<Langue, number>>;
  parCollection: Partial<Record<CollectionGuide, number>>;
};

export const nombreGuides = derived<[typeof guidesStore], NombreResultats>(
  [guidesStore],
  ([guidesStore]) => {
    const creeObjetDepuisEnum = <T>(
      type: { [s: string]: T },
      calculNombre: (valeur: T) => number
    ) =>
      Object.fromEntries(Object.values(type).map((f) => [f, calculNombre(f)]));

    const nombreParLangue = (langue: Langue) =>
      guidesStore.filter((guide) => guide.langue === langue).length;

    const nombreParCollection = (collection: CollectionGuide) =>
      guidesStore.filter((guide) => guide.collections.includes(collection))
        .length;
    return {
      parLangue: creeObjetDepuisEnum(Langue, nombreParLangue),
      parCollection: creeObjetDepuisEnum(CollectionGuide, nombreParCollection),
    };
  }
);
