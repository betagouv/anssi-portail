import { derived } from 'svelte/store';
import { Langue } from '../Catalogue.types';
import { guidesStore } from './guides.store';

type NombreResultats = {
  parLangue: Partial<Record<Langue, number>>;
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
    return {
      parLangue: creeObjetDepuisEnum(Langue, nombreParLangue),
    };
  }
);
