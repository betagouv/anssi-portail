import { beforeEach, describe, expect, it } from "vitest";
import { get } from "svelte/store";
import {
  demainSpecialisteCyber,
  guidesTechniques,
  kitCyber,
  livretEnJeux,
  mss,
} from "./objetsExemples";
import { catalogueStore } from "../../../src/catalogue/stores/catalogue.store";
import { rechercheParBesoin } from "../../../src/catalogue/stores/rechercheParBesoin.store";
import { catalogueFiltre } from "../../../src/catalogue/stores/catalogueFiltre.store";
import { rechercheParDroitAcces } from "../../../src/catalogue/stores/rechercheParDroitAcces.store";
import {
  BesoinCyber,
  DroitAcces,
  FormatRessource,
  Source,
  Typologie,
} from "../../../src/catalogue/Catalogue.types";
import { rechercheParTypologie } from "../../../src/catalogue/stores/rechercheParTypologie.store";
import { rechercheParFormat } from "../../../src/catalogue/stores/rechercheParFormat.store";
import { rechercheParSource } from "../../../src/catalogue/stores/rechercheParSource.store";
import { limitationRecherche } from "../../../src/catalogue/stores/limitationRecherche";

describe("Le store du catalogue filtré", () => {
  beforeEach(() => {
    rechercheParBesoin.set(null);
    rechercheParDroitAcces.set([]);
    rechercheParTypologie.set([]);
    rechercheParFormat.set([]);
    rechercheParSource.set([]);
    limitationRecherche.set(0);
  });

  const repartitionVide = () => ({
    REAGIR: [],
    SE_FORMER: [],
    SECURISER: [],
    ETRE_SENSIBILISE: [],
  });

  describe("sur application d'un filtre de besoin", () => {
    it("conserve uniquement les items correspondants", () => {
      catalogueStore.initialise([mss(), demainSpecialisteCyber()], {
        REAGIR: [],
        SE_FORMER: [],
        SECURISER: ["/services/mss"],
        ETRE_SENSIBILISE: [],
      });
      rechercheParBesoin.set(BesoinCyber.SECURISER);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe("mss");
    });

    it("conserve tous les items en cas d'absence de besoins", () => {
      catalogueStore.initialise(
        [mss(), demainSpecialisteCyber()],
        repartitionVide(),
      );
      rechercheParBesoin.set(null);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre d'accessibilité", () => {
    it("conserve uniquement les items correspondants", () => {
      catalogueStore.initialise(
        [mss(), demainSpecialisteCyber()],
        repartitionVide(),
      );
      rechercheParDroitAcces.set([DroitAcces.ACCES_LIBRE]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe("DemainSpécialisteCyber");
    });

    it("conserve tous les items en cas d'absence de droits d'acces", () => {
      catalogueStore.initialise(
        [mss(), demainSpecialisteCyber()],
        repartitionVide(),
      );
      rechercheParDroitAcces.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre de typologie", () => {
    it("peut conserver uniquement les services", () => {
      catalogueStore.initialise([mss(), livretEnJeux()], repartitionVide());
      rechercheParTypologie.set([Typologie.SERVICE]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe("mss");
    });

    it("conserve tous les items quand aucun filtre actif", () => {
      catalogueStore.initialise([mss(), livretEnJeux()], repartitionVide());
      rechercheParTypologie.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre de format", () => {
    it("conserve uniquement les items correspondant", () => {
      catalogueStore.initialise(
        [livretEnJeux(), guidesTechniques()],
        repartitionVide(),
      );
      rechercheParFormat.set([FormatRessource.PUBLICATION]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe("Guides techniques");
    });

    it("conserve tous les items quand aucun filtre actif", () => {
      catalogueStore.initialise(
        [livretEnJeux(), guidesTechniques()],
        repartitionVide(),
      );
      rechercheParFormat.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre de source", () => {
    // d'autres tests plus spécifiques sont dans rechercheParSource.store.spec
    it("conserve uniquement les items correspondants", () => {
      catalogueStore.initialise([mss(), kitCyber()], repartitionVide());
      rechercheParSource.set([Source.PARTENAIRES]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe("KIT CYBER");
    });

    it("conserve tous les items en cas d'absence de source", () => {
      catalogueStore.initialise(
        [mss(), demainSpecialisteCyber()],
        repartitionVide(),
      );
      rechercheParSource.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur limitation du nombre de résultats", () => {
    it("ne conserve que les x premiers éléments", () => {
      catalogueStore.initialise(
        [mss(), demainSpecialisteCyber()],
        repartitionVide(),
      );
      limitationRecherche.set(1);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
    });
  });
});
