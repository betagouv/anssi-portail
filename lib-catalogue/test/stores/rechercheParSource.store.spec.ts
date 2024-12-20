import { describe, expect, it } from "vitest";
import { rechercheParSource } from "../../src/stores/rechercheParSource.store";
import { DroitAcces, Source } from "../../src/Catalogue.types";
import { guidesTechniques, mss } from "./objetsExemples";
import { rechercheParDroitAcces } from "../../src/stores/rechercheParDroitAcces.store";
import { get } from "svelte/store";

describe("La recherche par source", () => {
  it("ne retourne pas l'item lorsque la primaire est ANSSI et la secondaire sélectionnée ne correspond pas", () => {
    rechercheParSource.set([Source.ANSSI, Source.CERTFR]);

    const resultat = rechercheParSource.ok(mss()); // mss = innovation

    expect(resultat).toBe(false);
  });

  it("retourne l'item lorsque la primaire est ANSSI et qu'il n'a pas de source secondaire", () => {
    rechercheParSource.set([Source.ANSSI, Source.CERTFR]);

    const resultat = rechercheParSource.ok(guidesTechniques()); // uniquement ANSSI

    expect(resultat).toBe(true);
  });

  it("ne retourne pas un item avec une unique source ANSSI lorsque la recherche exclut l'ANSSI", () => {
    rechercheParSource.set([Source.PARTENAIRES]);

    const resultat = rechercheParSource.ok(guidesTechniques()); // uniquement ANSSI

    expect(resultat).toBe(false);
  });

  it("est vide quand on la réinitialise", () => {
    rechercheParSource.set([Source.PARTENAIRES]);

    rechercheParSource.reinitialise();

    expect(get(rechercheParSource)).toEqual([]);
  });
});
