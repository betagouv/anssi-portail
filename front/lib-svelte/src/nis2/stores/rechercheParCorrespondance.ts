import { get, writable } from 'svelte/store';
import type { Correspondance, Exigence } from '../exigence.type';

const selectionCorrespondance = writable<
  Correspondance['niveau'] | undefined
>();

export const rechercheParCorrespondance = {
  subscribe: selectionCorrespondance.subscribe,
  set: selectionCorrespondance.set,
  reinitialise: () => selectionCorrespondance.set(undefined),
  ok: (exigence: Exigence) => {
    const niveauCourant = get(selectionCorrespondance);
    return !niveauCourant || exigence.correspondance?.niveau === niveauCourant;
  },
};
