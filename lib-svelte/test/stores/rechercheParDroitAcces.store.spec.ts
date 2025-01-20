import { describe, expect, it } from "vitest";
import { DroitAcces } from "../../src/catalogue/Catalogue.types";
import { get } from "svelte/store";
import { rechercheParDroitAcces } from "../../src/catalogue/stores/rechercheParDroitAcces.store";

describe("La recherche par droit d'accès", () => {
  it("est vide quand on la réinitialise", () => {
    rechercheParDroitAcces.set([
      DroitAcces.ACCES_LIBRE,
      DroitAcces.REGULES_NIS2,
    ]);

    rechercheParDroitAcces.reinitialise();

    expect(get(rechercheParDroitAcces)).toEqual([]);
  });
});
