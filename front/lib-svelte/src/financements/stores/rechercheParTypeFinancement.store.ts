import { get, writable } from 'svelte/store';
import type { ResumeFinancement } from '../financement';

const selectionTypeFinancement = writable<string[]>([]);

export const rechercheParTypeFinancement = {
  set: selectionTypeFinancement.set,
  subscribe: selectionTypeFinancement.subscribe,
  reinitialise: () => selectionTypeFinancement.set([]),
  ok: (resumeFinancement: ResumeFinancement): boolean =>
    !get(selectionTypeFinancement).length ||
    resumeFinancement.typesDeFinancement.some((type) =>
      get(selectionTypeFinancement).includes(type)
    ),
};
