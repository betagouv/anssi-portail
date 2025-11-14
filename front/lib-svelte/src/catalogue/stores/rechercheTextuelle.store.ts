import { get, writable } from 'svelte/store';

const store = writable<string>('');

export const rechercheTextuelle = {
  subscribe: store.subscribe,
  set: store.set,
  reinitialise: () => store.set(''),
  ok: (
    item:
      | { nom: string; description: string }
      | { titre: string; description: string }
  ) => {
    if (!get(rechercheTextuelle)) return true;
    const nom = 'nom' in item ? item.nom : item.titre;
    return (
      nom
        ?.replace('&ZeroWidthSpace;', '')
        .toLowerCase()
        .includes(get(rechercheTextuelle).toLowerCase()) ||
      (item.description ?? '')
        .toLowerCase()
        .includes(get(rechercheTextuelle).toLowerCase())
    );
  },
};
