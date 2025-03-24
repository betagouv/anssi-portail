import { derived, writable } from 'svelte/store';
import axios from 'axios';
import { profilStore } from './profil.store';

const favoris = writable<string[]>([]);

const { subscribe: ecouteLetatDuProfil } = derived(
  profilStore,
  async ($profilStore) => {
    if ($profilStore) {
      const reponse = await axios.get<string[]>('/api/favoris');
      return reponse.data;
    }
    return [];
  }
);

ecouteLetatDuProfil(async (value) => {
  favoris.set(await value);
});

export const favorisStore = {
  subscribe: favoris.subscribe,
  ajoute: (favori: string) => favoris.update((current) => [...current, favori]),
  retire: (favori: string) =>
    favoris.update((current) => current.filter((item) => item !== favori)),
};
