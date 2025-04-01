import { describe, expect, it } from "vitest";
import { DroitAcces } from "../../../src/catalogue/Catalogue.types";
import { get } from "svelte/store";
import { rechercheParDroitAcces } from "../../../src/catalogue/stores/rechercheParDroitAcces.store";
import { mss } from "./objetsExemples";

describe("La recherche par droit d'accès", () => {
  it("est vide quand on la réinitialise", () => {
    rechercheParDroitAcces.set([
      DroitAcces.ACCES_LIBRE,
      DroitAcces.REGULES_NIS2,
    ]);

    rechercheParDroitAcces.reinitialise();

    expect(get(rechercheParDroitAcces)).toEqual([]);
  });

  it("reste robuste lorsqu'un item n'a pas de droit d'acces", () => {
    rechercheParDroitAcces.set([DroitAcces.ACCES_LIBRE]);
    const sansDroitDAcces = { ...mss() };
    delete sansDroitDAcces.droitsAcces;

    const resultat = rechercheParDroitAcces.ok(sansDroitDAcces);

    expect(resultat).toBe(false)
  });
});
