import { derived, writable } from 'svelte/store';
import type { ReponsesResultatTest } from '../ResultatsTest.type';

export type Questionnaire = {
  questionCourante: number;
  toutesLesReponses: number[];
};

const { set, subscribe, update } = writable<Questionnaire>();

export const questionnaireStore = {
  subscribe,
  initialise: () =>
    set({ questionCourante: 0, toutesLesReponses: new Array(6).fill(null) }),

  reponds(reponseQuestionCourante: number) {
    update((state) => {
      state.toutesLesReponses[state.questionCourante] = reponseQuestionCourante;
      state.questionCourante++;

      return state;
    });
  },

  reviensEnArriere() {
    update((state) => {
      state.questionCourante--;
      return state;
    });
  },

  chargeReponses(reponses: ReponsesResultatTest) {
    update((state) => {
      state.toutesLesReponses[0] = reponses['prise-en-compte-risque'] - 1;
      state.toutesLesReponses[1] = reponses.posture - 1;
      state.toutesLesReponses[2] = reponses.pilotage - 1;
      state.toutesLesReponses[3] = reponses['ressources-humaines'] - 1;
      state.toutesLesReponses[4] = reponses.budget - 1;
      state.toutesLesReponses[5] = reponses['adoption-solutions'] - 1;
      return state;
    });
  },
};

export const resultatsQuestionnaire = derived(
  questionnaireStore,
  ($questionnaireStore) => {
    function reponse(question: number) {
      const resultat = $questionnaireStore.toutesLesReponses[question];
      return resultat === null ? null : resultat + 1;
    }

    return {
      'prise-en-compte-risque': reponse(0),
      pilotage: reponse(2),
      budget: reponse(4),
      'ressources-humaines': reponse(3),
      'adoption-solutions': reponse(5),
      posture: reponse(1),
    };
  }
);
