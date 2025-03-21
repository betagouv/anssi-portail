import { writable } from 'svelte/store';
import axios from 'axios';

const { subscribe, set } = writable<string[]>([]);

axios.get<string[]>('/api/favoris').then(async ({ data: favoris }) => {
  set(favoris);
});

export const favorisStore = {
  subscribe,
};
