import { get, writable } from 'svelte/store';

import type { RésuméFinancement } from '../financement';

const selectionRegions = writable<string>('');

export const rechercheParRegion = {
  subscribe: selectionRegions.subscribe,
  set: selectionRegions.set,
  reinitialise: () => selectionRegions.set(''),
  ok: (résuméFinancement: RésuméFinancement): boolean => {
    const regionFiltree = get(selectionRegions);
    return (
      !regionFiltree ||
      résuméFinancement.régions.includes('FRANCE') ||
      résuméFinancement.régions.includes(regionFiltree)
    );
  },
};
