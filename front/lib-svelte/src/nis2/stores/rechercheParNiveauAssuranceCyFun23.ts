import { get, writable } from 'svelte/store';
import type { CyFun23NiveauAssurance, Exigence } from '../exigence.type';

const selectionNiveauAssurance = writable<CyFun23NiveauAssurance | undefined>();

export const rechercheParNiveauAssuranceCyFun23 = {
  subscribe: selectionNiveauAssurance.subscribe,
  set: selectionNiveauAssurance.set,
  reinitialise: () => selectionNiveauAssurance.set(undefined),
  ok: (exigence: Exigence) => {
    if (!('niveauAssurance' in exigence)) return true;
    const niveauAssuranceCourant = get(selectionNiveauAssurance);
    return (
      !niveauAssuranceCourant ||
      exigence.niveauAssurance === niveauAssuranceCourant
    );
  },
};
