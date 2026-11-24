import { get, writable } from 'svelte/store';
import type { RésuméFinancement } from '../financement';

const selectionTypeFinancement = writable<string[]>([]);

export const rechercheParTypeFinancement = {
  set: selectionTypeFinancement.set,
  subscribe: selectionTypeFinancement.subscribe,
  reinitialise: () => selectionTypeFinancement.set([]),
  ok: (résuméFinancement: RésuméFinancement): boolean =>
    !get(selectionTypeFinancement).length ||
    résuméFinancement.typesDeFinancement.some((type) => get(selectionTypeFinancement).includes(type)),
};
