import { writable } from 'svelte/store';
import type { BesoinCyber } from '../Catalogue.types';

const selectionBesoins = writable<BesoinCyber | null>();

export const rechercheParBesoin = {
  subscribe: selectionBesoins.subscribe,
  set: selectionBesoins.set,
  reinitialise: () => selectionBesoins.set(null),
};
