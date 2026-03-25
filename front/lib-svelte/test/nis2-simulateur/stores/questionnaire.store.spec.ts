import { describe, expect, it } from "vitest";
import { get } from "svelte/store";

import { questionnaireStore } from "../../../src/nis2-simulateur/stores/questionnaire.store";

describe("le store du questionnaire NIS2", () => {
  it("existe", () => {
    expect(true).toBe(true);
  });

  it("indique l'étape préalable comme l'étape de départ", () => {
    const store = get(questionnaireStore);
    expect(store.etapeCourante).toBe("prealable");
  });

  it("passe à l'étape désignation quand l'étape préalable est validée", () => {
    questionnaireStore.repond({
      type: "VALIDE_ETAPE_PREALABLE",
    });
    expect(get(questionnaireStore).etapeCourante).toBe("designationOperateurServicesEssentiels");
  });
});
