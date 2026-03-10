import { get, writable } from 'svelte/store';
import type { Exigence } from '../exigence.type';

const selectionNorme = writable<string | undefined>();

export const rechercheParNormeISO = {
  subscribe: selectionNorme.subscribe,
  set: selectionNorme.set,
  reinitialise: () => selectionNorme.set(undefined),
  ok: (exigence: Exigence) => {
    if (!('norme' in exigence)) return true;
    const normeSelectionnee = get(selectionNorme);
    return !normeSelectionnee || exigence.norme === normeSelectionnee;
  },
};
