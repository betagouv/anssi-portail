import { describe, expect, it } from "vitest";
import {
  FormatRessource,
  Typologie,
} from "../../../src/catalogue/Catalogue.types";
import { get } from "svelte/store";
import { rechercheParTypologie } from "../../../src/catalogue/stores/rechercheParTypologie.store";
import { rechercheParFormat } from "../../../src/catalogue/stores/rechercheParFormat.store";

describe("La recherche par format", () => {
  it("est vide quand on la réinitialise", () => {
    rechercheParFormat.set([FormatRessource.PUBLICATION]);

    rechercheParFormat.reinitialise();

    expect(get(rechercheParFormat)).toEqual([]);
  });
});
