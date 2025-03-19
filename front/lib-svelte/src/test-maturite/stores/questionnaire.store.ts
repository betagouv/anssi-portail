import { derived, writable } from 'svelte/store';

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
};

export const resultatsQuestionnaire = derived(
  questionnaireStore,
  ($questionnaireStore) => {
    function reponse(question: number) {
      let resultat = $questionnaireStore.toutesLesReponses[question];
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
