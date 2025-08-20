import { writable } from 'svelte/store';
import type { ResumeFinancement } from '../financement';

const { subscribe, set } = writable<ResumeFinancement[]>([]);

export const financementsStore = {
  subscribe,
  initialise: (resumesFinancement: ResumeFinancement[]) => {
    set([...resumesFinancement]);
  },
};
