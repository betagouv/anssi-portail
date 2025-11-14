import { writable } from 'svelte/store';
import { type Guide } from '../Catalogue.types';

const { subscribe, set } = writable<Guide[]>([]);

export const guidesStore = {
  subscribe,
  initialise: (guides: Guide[]) => {
    set([...guides]);
  },
};
