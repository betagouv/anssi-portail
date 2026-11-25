import axios from 'axios';
import { getContext } from 'svelte';
import { get, writable, type Readable } from 'svelte/store';
import { verifieResultatTestARevendiquer } from '../test-maturite/resultatTest';
import type { Profil, ProfilNavigation } from './profil';

export type { Profil } from './profil';

const { subscribe, set } = writable<Profil | undefined>(undefined);

// import.meta.env.VITE_API_URL n'est défini que pour les builds webc-externes (voir leurs
// scripts build:*) : dans ce contexte, l'utilisateur est toujours anonyme, donc pas de profil à
// récupérer, et l'appel relatif /api/profil ciblerait de toute façon le mauvais serveur une fois
// le composant embarqué sur un site tiers.
if (typeof window !== 'undefined' && !import.meta.env.MSC_SVELTEKIT && !import.meta.env.VITE_API_URL) {
  axios
    .get<Profil>('/api/profil')
    .then(async ({ data: profil }) => {
      if (profil.email) {
        set(profil);
        await verifieResultatTestARevendiquer();
        return;
      }
      set(undefined);
    })
    .catch(() => {
      set(undefined);
    });
}

export const profilStore = {
  subscribe,
  utilisateurEstConnecte: (): boolean => !!get(profilStore)?.email,
};

export const utiliseProfil = () => getContext<Readable<ProfilNavigation | undefined>>('profilMSC') ?? profilStore;
