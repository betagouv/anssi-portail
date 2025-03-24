import { get, writable } from 'svelte/store';
import axios from 'axios';
import { profilStore } from './profil.store';

const { subscribe, set } = writable<string[]>([]);

if (profilStore.utilisateurEstConnecte()) {
  axios
    .get<string[]>('/api/favoris')
    .then(async ({ data: favoris }) => {
      set(favoris);
    })
    .catch((_) => {
      set([]);
    });
}

export const favorisStore = {
  subscribe,
  set,
  ajoute: (favori: string) => set([...get(favorisStore), favori]),
  retire: (favori: string) =>
    set(get(favorisStore).filter((f) => f !== favori)),
};
