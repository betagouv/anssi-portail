import { get, writable } from 'svelte/store';
import axios from 'axios';
import { verifieResultatTestARevendiquer } from '../test-maturite/resultatTest';

type Profil = {
  prenom: string;
  nom: string;
  email: string;
  siret: string;
  estAgentAnssi: boolean;
  idListeFavoris: string;
  codeDepartement: string | undefined;
  codeRegion: string | undefined;
};

const { subscribe, set } = writable<Profil | undefined>(undefined);

axios.get<Profil>('/api/profil').then(async ({ data: profil }) => {
  if (profil.email) {
    set(profil);
    await verifieResultatTestARevendiquer();
    return;
  }
  set(undefined);
});

export const profilStore = {
  subscribe,
  utilisateurEstConnecte: (): boolean => !!get(profilStore)?.email,
};
