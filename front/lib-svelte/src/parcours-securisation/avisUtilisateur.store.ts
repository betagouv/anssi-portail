import { writable } from 'svelte/store';

export type AvisUtilisateur = {
  positif: boolean;
};

const prefixe = 'mesures:';

const recupereTousLesAvis = (): Record<string, AvisUtilisateur> => {
  return Object.keys(localStorage).reduce(
    (acc, key) => {
      if (key.startsWith(prefixe)) {
        const id = key.slice(prefixe.length);
        acc[id] = JSON.parse(localStorage.getItem(key) ?? '{}');
      }
      return acc;
    },
    {} as Record<string, AvisUtilisateur>
  );
};

const { subscribe, update } = writable<Record<string, AvisUtilisateur>>(recupereTousLesAvis());

export const storeAvisUtilisateur = {
  ajouteAvis: (idMesure: string, avis: AvisUtilisateur) => {
    update((avisActuels) => {
      localStorage.setItem(`${prefixe}${idMesure}`, JSON.stringify({ positif: avis.positif }));
      return { ...avisActuels, [idMesure]: avis };
    });
  },
  supprimeAvis: (idMesure: string) => {
    update((avisActuels) => {
      localStorage.removeItem(`${prefixe}${idMesure}`);
      delete avisActuels[idMesure];
      return avisActuels;
    });
  },
  subscribe,
};
