import { writable } from "svelte/store";

type EtatQuestionnaire = {
  etapeCourante: "prealable" | "designationOperateurServicesEssentiels",
};

const { set, subscribe } = writable<EtatQuestionnaire>({
  etapeCourante: "prealable",
});

const repond = (reponse: { type: string, }) => {
  if (reponse.type === "VALIDE_ETAPE_PREALABLE") {
    set({
      etapeCourante: "designationOperateurServicesEssentiels",
    })
  }
};

export const questionnaireStore = {
  subscribe,
  repond,
}
