import { get, writable } from 'svelte/store';
import type { Exigence } from '../exigence.type';

const selectionObjectif = writable<string | undefined>();

export const rechercheParObjectifNis2 = {
  subscribe: selectionObjectif.subscribe,
  set: selectionObjectif.set,
  reinitialise: () => selectionObjectif.set(undefined),
  ok: (exigence: Exigence) => {
    if (!('objectifSecurite' in exigence)) return true;
    const objectifCourant = get(selectionObjectif);
    return !objectifCourant || exigence.objectifSecurite === objectifCourant;
  },
};
