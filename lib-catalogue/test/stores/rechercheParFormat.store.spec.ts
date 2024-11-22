import { describe, expect, it } from "vitest";
import {FormatRessource, Typologie} from "../../src/Catalogue.types";
import { get } from "svelte/store";
import { rechercheParTypologie } from "../../src/stores/rechercheParTypologie.store";
import {rechercheParFormat} from "../../src/stores/rechercheParFormat.store";

describe("La recherche par format", () => {
  it("est vide quand on la réinitialise", () => {
    rechercheParFormat.set([FormatRessource.PDF]);

    rechercheParFormat.reinitialise();

    expect(get(rechercheParFormat)).toEqual([]);
  });
});