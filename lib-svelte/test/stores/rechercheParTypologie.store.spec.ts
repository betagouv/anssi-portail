import { describe, expect, it } from "vitest";
import { Typologie } from "../../src/Catalogue.types";
import { get } from "svelte/store";
import { rechercheParTypologie } from "../../src/stores/rechercheParTypologie.store";

describe("La recherche par typologie", () => {
  it("est vide quand on la réinitialise", () => {
    rechercheParTypologie.set([Typologie.RESSOURCE]);

    rechercheParTypologie.reinitialise();

    expect(get(rechercheParTypologie)).toEqual([]);
  });
});
