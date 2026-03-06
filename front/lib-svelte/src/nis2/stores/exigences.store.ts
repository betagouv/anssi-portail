import { writable } from 'svelte/store';
import type { Exigence } from '../exigence.type';

const { subscribe, set } = writable<Exigence[]>([]);

export const exigencesStore = {
  set,
  subscribe,
  initialise: (exigences: Exigence[]) => {
    set(exigences);
  },
};
