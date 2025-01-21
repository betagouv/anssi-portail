import { beforeEach, describe, expect, it } from "vitest";
import { get } from "svelte/store";
import { questionnaireStore } from "../../../src/test-maturite/stores/questionnaire.store";

describe("Le store du questionnaire", () => {
  beforeEach(() => {
    questionnaireStore.initialise();
  });

  it("démarre à la première question", () => {
    const { questionCourante } = get(questionnaireStore);
    expect(questionCourante).toBe(0);
  });

  it("ne connaît aucune réponse", () => {
    const { toutesLesReponses } = get(questionnaireStore);
    expect(toutesLesReponses).toEqual([null, null, null, null, null, null]);
  });

  it("peut répondre à la question courante", () => {
    questionnaireStore.reponds(4);

    const { toutesLesReponses, questionCourante } = get(questionnaireStore);
    expect(toutesLesReponses).toEqual([4, null, null, null, null, null]);
    expect(questionCourante).toBe(1);
  });

  it("peut revenir en arrière sur la question précédente", () => {
    questionnaireStore.reponds(10);

    questionnaireStore.reviensEnArriere();

    const { toutesLesReponses, questionCourante } = get(questionnaireStore);
    expect(questionCourante).toBe(0);
    expect(toutesLesReponses).toEqual([10, null, null, null, null, null]);
  });

  it("scénario : peut répondre à toutes les questions puis revenir au milieu pour modifier une réponse", () => {
    questionnaireStore.reponds(10);
    questionnaireStore.reponds(20);
    questionnaireStore.reponds(30);
    questionnaireStore.reponds(40);
    questionnaireStore.reponds(50);
    questionnaireStore.reponds(60);
    questionnaireStore.reviensEnArriere();
    questionnaireStore.reviensEnArriere();
    questionnaireStore.reviensEnArriere();
    questionnaireStore.reponds(41);

    const { toutesLesReponses, questionCourante } = get(questionnaireStore);
    expect(questionCourante).toBe(4);
    expect(toutesLesReponses).toEqual([10, 20, 30, 41, 50, 60]);
  });
});
