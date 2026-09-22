import { get, writable } from 'svelte/store';
import { Typologie, type ItemCyber } from '../Catalogue.types';

const selectionDeTypologies = writable<Typologie[]>([]);

export const rechercheParTypologie = {
  subscribe: selectionDeTypologies.subscribe,
  set: selectionDeTypologies.set,
  reinitialise: () => selectionDeTypologies.set([]),
  ok: (item: ItemCyber) =>
    get(rechercheParTypologie).length === 0 || get(rechercheParTypologie).includes(item.typologie),
};
