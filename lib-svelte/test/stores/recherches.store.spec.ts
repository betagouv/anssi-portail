import { beforeEach, describe, expect, it } from "vitest";
import { rechercheParDroitAcces } from "../../src/catalogue/stores/rechercheParDroitAcces.store";
import {
  BesoinCyber,
  DroitAcces,
  FormatRessource,
  Source,
  ThemeCyber,
  Typologie,
} from "../../src/catalogue/Catalogue.types";
import { get } from "svelte/store";
import { recherches } from "../../src/catalogue/stores/recherches.store";
import { rechercheParBesoin } from "../../src/catalogue/stores/rechercheParBesoin.store";
import { rechercheParTheme } from "../../src/catalogue/stores/rechercheParTheme.store";
import { rechercheParFormat } from "../../src/catalogue/stores/rechercheParFormat.store";
import { rechercheParTypologie } from "../../src/catalogue/stores/rechercheParTypologie.store";
import { rechercheParSource } from "../../src/catalogue/stores/rechercheParSource.store";

describe("Le store des recherches", () => {
  beforeEach(() => {
    rechercheParDroitAcces.set([]);
    rechercheParBesoin.set(null);
    rechercheParTheme.set([]);
    rechercheParFormat.set([]);
    rechercheParTypologie.set([]);
    rechercheParSource.set([]);
  });

  describe("indique qu'un filtre est actif lorsque ", () => {
    it("la recherche par besoin est active", () => {
      rechercheParBesoin.set(BesoinCyber.REAGIR);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it("la recherche par droit d'acces est active", () => {
      rechercheParDroitAcces.set([DroitAcces.ACCES_LIBRE]);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it("la recherche par typologie est active", () => {
      rechercheParTypologie.set([Typologie.SERVICE]);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it("la recherche par format est active", () => {
      rechercheParFormat.set([FormatRessource.PDF]);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it("la recherche par source est active", () => {
      rechercheParSource.set([Source.INNOVATION_ANSSI]);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });

    it("la recherche par thème est active", () => {
      rechercheParTheme.set([ThemeCyber.RESILIENCE]);

      const { filtreActif } = get(recherches);

      expect(filtreActif).toBe(true);
    });
  });

  it("indique lorsqu'aucun filtre n'est actif", () => {
    const { filtreActif } = get(recherches);

    expect(filtreActif).toBe(false);
  });
});
