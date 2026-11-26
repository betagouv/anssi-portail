import { writable } from 'svelte/store';

import type { RésuméFinancement } from '../financement';

const { subscribe, set } = writable<RésuméFinancement[]>([]);

export const financementsStore = {
  subscribe,
  initialise: (résumésFinancement: RésuméFinancement[]) => {
    set([...résumésFinancement]);
  },
};
