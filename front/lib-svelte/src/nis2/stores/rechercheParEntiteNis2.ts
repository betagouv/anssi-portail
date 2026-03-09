import { get, writable } from 'svelte/store';
import type { CategorieEntite, Exigence } from '../exigence.type';

const selectionEntite = writable<CategorieEntite | undefined>();

export const rechercheParEntiteNis2 = {
  subscribe: selectionEntite.subscribe,
  set: selectionEntite.set,
  reinitialise: () => selectionEntite.set(undefined),
  ok: (exigence: Exigence) => {
    if (!('entitesCible' in exigence)) return true;
    const entiteCourante = get(selectionEntite);
    return !entiteCourante || exigence.entitesCible?.includes(entiteCourante);
  },
};
