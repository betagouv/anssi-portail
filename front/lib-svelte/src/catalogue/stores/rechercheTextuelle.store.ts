import { get, writable } from 'svelte/store';
import type { ItemCyber } from '../Catalogue.types';
import type { Guide } from '../Guide.types';

const store = writable<string>('');

export const rechercheTextuelle = {
  subscribe: store.subscribe,
  set: store.set,
  reinitialise: () => store.set(''),
  ok: (item: ItemCyber | Guide) => {
    if (!get(rechercheTextuelle)) return true;
    return (
      item.nom
        .replace('&ZeroWidthSpace;', '')
        .toLowerCase()
        .includes(get(rechercheTextuelle).toLowerCase()) ||
      (item.description ?? '')
        .toLowerCase()
        .includes(get(rechercheTextuelle).toLowerCase())
    );
  },
};
