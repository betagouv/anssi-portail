import { describe, expect, it } from "vitest";
import { rechercheParBesoin } from "../../src/stores/rechercheParBesoin.store";
import { BesoinCyber } from "../../src/Catalogue.types";
import {get} from "svelte/store";

describe("La recherche par besoin", () => {
  it("est vide quand on la réinitialise", () => {
    rechercheParBesoin.set(BesoinCyber.REAGIR);

    rechercheParBesoin.reinitialise();

    expect(get(rechercheParBesoin)).toBeNull();
  });
});