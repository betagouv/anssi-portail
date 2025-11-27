import axios from 'axios';
import { writable } from 'svelte/store';
import { type Guide } from '../../Guide.types';
import { guidePourCarteItem } from '../../guides/guide';

const { subscribe, set } = writable<Guide[]>([]);

export const chargeGuidesDansLeStore = async () => {
  const reponseGuides = await axios.get<Guide[]>('/api/guides');
  const guides = reponseGuides.data.map(guidePourCarteItem);
  guidesStore.initialise(guides);
};

export const guidesStore = {
  subscribe,
  initialise: (guides: Guide[]) => {
    set([...guides]);
  },
};
