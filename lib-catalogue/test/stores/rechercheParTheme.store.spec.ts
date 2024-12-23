import { describe, expect, it } from "vitest";
import { ThemeCyber } from "../../src/Catalogue.types";
import { get } from "svelte/store";
import { rechercheParTheme } from "../../src/stores/rechercheParTheme.store";

describe("La recherche par thème", () => {
  it("est vide quand on la réinitialise", () => {
    rechercheParTheme.set([ThemeCyber.RESILIENCE]);

    rechercheParTheme.reinitialise();

    expect(get(rechercheParTheme)).toEqual([]);
  });
});
