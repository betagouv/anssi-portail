import { get, writable } from 'svelte/store';
import type { Exigence } from '../exigence.type';

const selectionThematique = writable<string | undefined>();

export const rechercheParThematiqueNis2 = {
  subscribe: selectionThematique.subscribe,
  set: selectionThematique.set,
  reinitialise: () => selectionThematique.set(undefined),
  ok: (exigence: Exigence) => {
    if (!('thematique' in exigence)) return true;
    const thematiqueCourante = get(selectionThematique);
    return !thematiqueCourante || exigence.thematique === thematiqueCourante;
  },
};
