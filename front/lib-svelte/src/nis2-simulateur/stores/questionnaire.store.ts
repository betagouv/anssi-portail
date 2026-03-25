import { writable } from 'svelte/store';
import type { ActionQuestionnaire } from './actions';
import type { EtatQuestionnaire } from '../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';
import { EtatQuestionnaireVide } from '../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire';

const etatInitial = () => EtatQuestionnaireVide;

const { set, subscribe, update } = writable<EtatQuestionnaire>(etatInitial());

const reset = () => {
  set(etatInitial());
};

const repond = (reponse: ActionQuestionnaire) => {
  if (reponse.type === 'VALIDE_ETAPE_PREALABLE') {
    set({
      ...etatInitial(),
      etapeCourante: 'designationOperateurServicesEssentiels',
    });
  } else if (reponse.type === 'VALIDE_ETAPE_DESIGNATION') {
    update((etat) => ({
      ...etat,
      etapeCourante: 'appartenanceUnionEuropeenne',
      designationOperateurServicesEssentiels: reponse.designations,
    }));
  } else if (reponse.type === 'VALIDE_ETAPE_APPARTENANCE_UE') {
    update((etat) => ({
      ...etat,
      etapeCourante: 'typeStructure',
      appartenancePaysUnionEuropeenne: reponse.appartenances,
    }));
  } else if (reponse.type === 'VALIDE_ETAPE_TYPE_STRUCTURE') {
    update((etat) => ({
      ...etat,
      etapeCourante: 'tailleEntitePrivee',
      typeStructure: reponse.types,
    }));
  } else if (reponse.type === 'VALIDE_ETAPE_TAILLE_ENTITE_PRIVEE') {
    update((etat) => ({
      ...etat,
      etapeCourante: 'secteursActivite',
      trancheNombreEmployes: reponse.nombreEmployes,
      trancheChiffreAffaire: reponse.chiffreAffaire,
      trancheBilanFinancier: reponse.bilanFinancier,
    }));
  }
};

export const questionnaireStore = {
  subscribe,
  repond,
  reset,
};
