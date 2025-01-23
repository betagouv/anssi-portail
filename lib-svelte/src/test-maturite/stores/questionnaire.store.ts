import { writable } from "svelte/store";

export type Questionnaire = {
  questionCourante: number;
  toutesLesReponses: number[];
};

const { set, subscribe, update } = writable<Questionnaire>();

export const questionnaireStore = {
  subscribe,
  initialise: () =>
    set({ questionCourante: 6, toutesLesReponses: new Array(6).fill(null) }),

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
