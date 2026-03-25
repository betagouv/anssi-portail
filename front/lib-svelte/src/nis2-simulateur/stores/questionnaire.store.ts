import { writable } from "svelte/store";
import type { ActionQuestionnaire } from "./actions";
import type { EtatQuestionnaire } from "../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire";
import { EtatQuestionnaireVide } from "../../../../../back/src/metier/nis2-simulateur/EtatQuestionnaire";

const etatInitial = () => EtatQuestionnaireVide;

const { set, subscribe, update } = writable<EtatQuestionnaire>(etatInitial());

const reset = () => {
  set(etatInitial())
};

const repond = (reponse: ActionQuestionnaire) => {
  if (reponse.type === "VALIDE_ETAPE_PREALABLE") {
    set({
      ...etatInitial(),
      etapeCourante: "designationOperateurServicesEssentiels",
    })
  }
  else if (reponse.type === "VALIDE_ETAPE_DESIGNATION") {
    update((etat) => ({
      ...etat,
      etapeCourante: "appartenanceUnionEuropeenne",
      designationOperateurServicesEssentiels: reponse.designations,
    }))
  }
};

export const questionnaireStore = {
  subscribe,
  repond,
  reset,
}
