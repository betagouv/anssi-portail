import { get, writable } from 'svelte/store';
import type { ResumeFinancement } from '../financement';

const selectionRegions = writable<string>('');

export const rechercheParRegion = {
  subscribe: selectionRegions.subscribe,
  set: selectionRegions.set,
  reinitialise: () => selectionRegions.set(''),
  ok: (resumeFinancement: ResumeFinancement): boolean => {
    const regionFiltree = get(selectionRegions);
    return (
      !regionFiltree ||
      resumeFinancement.regions.includes('FRANCE') ||
      resumeFinancement.regions.includes(regionFiltree)
    );
  },
};
