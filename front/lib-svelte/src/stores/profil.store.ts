import { get, writable } from 'svelte/store';
import axios from 'axios';

type Profil = {
  prenom: string;
  nom: string;
  email: string;
  siret: string;
};

const { subscribe, set } = writable<Profil | undefined>(undefined);

axios.get<Profil>('/api/profil').then(({ data: profil }) => {
  if (profil.email) {
    set(profil);
    return;
  }
  set(undefined);
});

export const profilStore = {
  subscribe,
  utilisateurEstConnecte: (): boolean => !!get(profilStore)?.email,
};
