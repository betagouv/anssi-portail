import { writable } from 'svelte/store';

export type AvisUtilisateur = {
  positif: boolean;
};

const { subscribe, update } = writable<Record<string, AvisUtilisateur>>({});

export const storeAvisUtilisateur = {
  ajouteAvis: (idMesure: string, avis: AvisUtilisateur) => {
    update((avisActuels) => ({ ...avisActuels, [idMesure]: avis }));
  },
  supprimeAvis: (idMesure: string) => {
    update((avisActuels) => {
      delete avisActuels[idMesure];
      return avisActuels;
    });
  },
  subscribe,
};
