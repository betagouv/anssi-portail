import { get, writable } from 'svelte/store';
import type { CyFun23Fonction, Exigence } from '../exigence.type';

const selectionFonction = writable<CyFun23Fonction | undefined>();

export const rechercheParFonctionCyFun23 = {
  subscribe: selectionFonction.subscribe,
  set: selectionFonction.set,
  reinitialise: () => selectionFonction.set(undefined),
  ok: (exigence: Exigence) => {
    if (!('fonction' in exigence)) return true;
    const fonctionCourante = get(selectionFonction);
    return !fonctionCourante || exigence.fonction === fonctionCourante;
  },
};
