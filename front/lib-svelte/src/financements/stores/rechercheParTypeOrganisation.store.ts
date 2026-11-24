import { get, writable } from 'svelte/store';
import type { RésuméFinancement } from '../financement';

const selectionTypeOrganisation = writable<string[]>([]);

export const rechercheParTypeOrganisation = {
  subscribe: selectionTypeOrganisation.subscribe,
  set: selectionTypeOrganisation.set,
  reinitialise: () => selectionTypeOrganisation.set([]),
  ok: (résuméFinancement: RésuméFinancement): boolean =>
    !get(selectionTypeOrganisation).length ||
    résuméFinancement.entitesElligibles.some((entite) => get(selectionTypeOrganisation).includes(entite)),
};
