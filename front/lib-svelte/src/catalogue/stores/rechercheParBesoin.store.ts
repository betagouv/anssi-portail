import { get, writable } from 'svelte/store';
import { BesoinCyber } from '../Catalogue.types';
import type { Guide } from '../Guide.types';

const selectionBesoins = writable<BesoinCyber | null>();

export const rechercheParBesoin = {
  subscribe: selectionBesoins.subscribe,
  set: selectionBesoins.set,
  reinitialise: () => selectionBesoins.set(null),
  ok: (guide: Guide) => {
    const besoinSelectionne = get(selectionBesoins);
    if (!besoinSelectionne || besoinSelectionne === BesoinCyber.TOUS) {
      return true;
    }
    return guide.besoins.includes(besoinSelectionne);
  },
};
