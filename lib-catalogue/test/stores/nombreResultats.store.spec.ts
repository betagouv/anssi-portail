import { describe, expect, it } from "vitest";
import { DroitAcces } from "../../src/Catalogue.types";
import { nombreResultats } from "../../src/stores/nombreResultats.store";
import { get } from "svelte/store";
import { catalogueStore } from "../../src/stores/catalogue.store";
import { demainSpecialisteCyber, monEspaceNIS2, mss } from "./objetsExemples";

describe("Le store du nombre de résultats", () => {
  describe("peut retourner le nombre par droit d'accès", () => {
    it("pour une entité publique", () => {
      catalogueStore.initialise([mss()], []);

      let parDroitAcces = get(nombreResultats).parDroitAcces;

      expect(parDroitAcces[DroitAcces.ACCES_LIBRE]).toBe(0);
      expect(parDroitAcces[DroitAcces.ENTITES_PUBLIQUES]).toBe(1);
    });

    it("pour un accès libre", () => {
      catalogueStore.initialise([demainSpecialisteCyber()], []);

      let parDroitAcces = get(nombreResultats).parDroitAcces;

      expect(parDroitAcces[DroitAcces.ACCES_LIBRE]).toBe(1);
      expect(parDroitAcces[DroitAcces.ENTITES_PUBLIQUES]).toBe(0);
    });

    it("pour une entité régulée / NIS2 qui est également en accès libre", () => {
      catalogueStore.initialise([monEspaceNIS2()], []);

      let parDroitAcces = get(nombreResultats).parDroitAcces;

      expect(parDroitAcces[DroitAcces.ACCES_LIBRE]).toBe(1);
      expect(parDroitAcces[DroitAcces.ENTITES_PUBLIQUES]).toBe(0);
      expect(parDroitAcces[DroitAcces.REGULES_NIS2]).toBe(1);
    });
  });
});
