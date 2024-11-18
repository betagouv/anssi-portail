import { describe, it, expect } from "vitest";
import { get } from "svelte/store";
import { demainSpecialisteCyber, mss } from "./objetsExemples";
import { catalogueStore } from "../../src/stores/catalogue.store";
import { rechercheParBesoin } from "../../src/stores/rechercheParBesoin.store";
import { catalogueFiltre } from "../../src/stores/catalogueFiltre.store";

describe("Le store du catalogue filtré", () => {
  describe("sur application d'un filtre de besoin", () => {
    it("conserve uniquement les items correspondants", () => {
      catalogueStore.initialise([mss(), demainSpecialisteCyber()], []);
      rechercheParBesoin.set("SECURISER");

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe("mss");
    });

    it("conserve tous les items en cas d'absence de besoins", () => {
      catalogueStore.initialise([mss(), demainSpecialisteCyber()], []);
      rechercheParBesoin.set("");

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });
});
