import { get, writable } from 'svelte/store';
import type { ResumeFinancement } from '../financement';

const selectionTypeOrganisation = writable<string[]>([]);

export const rechercheParTypeOrganisation = {
  subscribe: selectionTypeOrganisation.subscribe,
  set: selectionTypeOrganisation.set,
  reinitialise: () => selectionTypeOrganisation.set([]),
  ok: (resumeFinancement: ResumeFinancement): boolean =>
    !get(selectionTypeOrganisation).length ||
    resumeFinancement.entitesElligibles.some((entite) =>
      get(selectionTypeOrganisation).includes(entite)
    ),
};
