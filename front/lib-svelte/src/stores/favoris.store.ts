import { derived, writable } from 'svelte/store';
import axios from 'axios';
import { profilStore } from './profil.store';

export type ListeFavoris = string[];

const favoris = writable<ListeFavoris>([]);

const { subscribe: ecouteLetatDuProfil } = derived<
  typeof profilStore,
  ListeFavoris
>(profilStore, ($profilStore, set) => {
  if ($profilStore) {
    axios.get<ListeFavoris>('/api/favoris').then((reponse) => {
      set(reponse.data);
    });
  }
  set([]);
});

ecouteLetatDuProfil((value) => {
  favoris.set(value);
});

export const favorisStore = {
  subscribe: favoris.subscribe,
  ajoute: (favori: string) => favoris.update((current) => [...current, favori]),
  retire: (favori: string) =>
    favoris.update((current) => current.filter((item) => item !== favori)),
};
