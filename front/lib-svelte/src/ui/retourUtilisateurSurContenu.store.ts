import { writable } from 'svelte/store';

export type RetourUtilisateur = {
  positif: boolean;
};

export const storeRetourUtilisateurSurContenu = (préfixe: string) => {
  const recupereTousLesRetours = (): Record<string, RetourUtilisateur> => {
    return Object.keys(localStorage).reduce(
      (acc, key) => {
        if (key.startsWith(préfixe)) {
          const id = key.slice(préfixe.length);
          acc[id] = JSON.parse(localStorage.getItem(key) ?? '{}');
        }
        return acc;
      },
      {} as Record<string, RetourUtilisateur>
    );
  };

  const { subscribe, update } = writable<Record<string, RetourUtilisateur>>(recupereTousLesRetours());

  return {
    ajouteAvis: (clé: string, avis: RetourUtilisateur) => {
      update((avisActuels) => {
        localStorage.setItem(`${préfixe}${clé}`, JSON.stringify({ positif: avis.positif }));
        return { ...avisActuels, [clé]: avis };
      });
    },
    supprimeAvis: (clé: string) => {
      update((avisActuels) => {
        localStorage.removeItem(`${préfixe}${clé}`);
        delete avisActuels[clé];
        return avisActuels;
      });
    },
    subscribe,
  };
};
