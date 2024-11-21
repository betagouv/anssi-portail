import { describe, expect, it } from "vitest";
import { get } from "svelte/store";
import {
  demainSpecialisteCyber,
  guidesTechniques,
  livretEnJeux,
  mss,
} from "./objetsExemples";
import { catalogueStore } from "../../src/stores/catalogue.store";
import { rechercheParBesoin } from "../../src/stores/rechercheParBesoin.store";
import { catalogueFiltre } from "../../src/stores/catalogueFiltre.store";
import { rechercheParDroitAcces } from "../../src/stores/rechercheParDroitAcces.store";
import {
  BesoinCyber,
  DroitAcces,
  FormatRessource,
  Typologie,
} from "../../src/Catalogue.types";
import { rechercheParTypologie } from "../../src/stores/rechercheParTypologie.store";
import { rechercheParFormat } from "../../src/stores/rechercheParFormat.store";

describe("Le store du catalogue filtré", () => {
  describe("sur application d'un filtre de besoin", () => {
    it("conserve uniquement les items correspondants", () => {
      catalogueStore.initialise([mss(), demainSpecialisteCyber()], []);
      rechercheParBesoin.set(BesoinCyber.RENFORCER_LA_SECURITE);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe("mss");
    });

    it("conserve tous les items en cas d'absence de besoins", () => {
      catalogueStore.initialise([mss(), demainSpecialisteCyber()], []);
      rechercheParBesoin.set(null);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre d'accessibilité", () => {
    it("conserve uniquement les items correspondants", () => {
      catalogueStore.initialise([mss(), demainSpecialisteCyber()], []);
      rechercheParDroitAcces.set([DroitAcces.ACCES_LIBRE]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe("DemainSpécialisteCyber");
    });

    it("conserve tous les items en cas d'absence de droits d'acces", () => {
      catalogueStore.initialise([mss(), demainSpecialisteCyber()], []);
      rechercheParDroitAcces.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre de typologie", () => {
    it("peut conserver uniquement les services", () => {
      catalogueStore.initialise([mss()], [livretEnJeux()]);
      rechercheParTypologie.set([Typologie.SERVICE]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe("mss");
    });

    it("conserve tous les items quand aucun filtre actif", () => {
      catalogueStore.initialise([mss()], [livretEnJeux()]);
      rechercheParTypologie.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre de format", () => {
    it("conserve uniquement les items correspondant", () => {
      catalogueStore.initialise([], [livretEnJeux(), guidesTechniques()]);
      rechercheParFormat.set([FormatRessource.PDF]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe("Guides techniques");
    });

    it("conserve tous les items quand aucun filtre actif", ()=>{
      catalogueStore.initialise([], [livretEnJeux(), guidesTechniques()]);
      rechercheParFormat.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    })
  });
});
