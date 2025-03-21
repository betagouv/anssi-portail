import {get, writable} from 'svelte/store';
import axios from 'axios';

const { subscribe, set } = writable<string[]>([]);

axios.get<string[]>('/api/favoris').then(async ({ data: favoris }) => {
  set(favoris);
});

export const favorisStore = {
  subscribe,
  set,
  ajoute: (favori: string) => set([...get(favorisStore), favori]),
  retire: (favori: string)  => set(get(favorisStore).filter((f) => f !== favori)),
};
