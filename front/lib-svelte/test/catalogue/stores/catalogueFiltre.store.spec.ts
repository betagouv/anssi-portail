import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import {
  demainSpecialisteCyber,
  guidesTechniques,
  kitCyber,
  livretEnJeux,
  mss,
} from './objetsExemples';
import { catalogueStore } from '../../../src/catalogue/stores/catalogue.store';
import { rechercheParBesoin } from '../../../src/catalogue/stores/rechercheParBesoin.store';
import { catalogueFiltre } from '../../../src/catalogue/stores/catalogueFiltre.store';
import { rechercheParDroitAcces } from '../../../src/catalogue/stores/rechercheParDroitAcces.store';
import {
  BesoinCyber,
  DroitAcces,
  FormatRessource,
  type ItemCyber,
  Source,
  Typologie,
} from '../../../src/catalogue/Catalogue.types';
import { rechercheParTypologie } from '../../../src/catalogue/stores/rechercheParTypologie.store';
import { rechercheParFormat } from '../../../src/catalogue/stores/rechercheParFormat.store';
import { rechercheParSource } from '../../../src/catalogue/stores/rechercheParSource.store';
import { limitationRecherche } from '../../../src/catalogue/stores/limitationRecherche';
import { rechercheTextuelle } from '../../../src/catalogue/stores/rechercheTextuelle.store';

describe('Le store du catalogue filtré', () => {
  beforeEach(() => {
    rechercheParBesoin.set(null);
    rechercheParDroitAcces.set([]);
    rechercheParTypologie.set([]);
    rechercheParFormat.set([]);
    rechercheParSource.set([]);
    limitationRecherche.set(0);
  });

  const initialiseStoreCatalogue = (tous: ItemCyber[]) => {
    catalogueStore.initialise(tous, {
      REAGIR: [],
      SE_FORMER: [],
      SECURISER: [],
      ETRE_SENSIBILISE: [],
      TOUS: tous.map((item) => item.id),
    });
  };

  describe("sur application d'un filtre de besoin", () => {
    it('conserve uniquement les items correspondants', () => {
      catalogueStore.initialise([mss(), demainSpecialisteCyber()], {
        REAGIR: [],
        SE_FORMER: [],
        SECURISER: ['/services/mss'],
        ETRE_SENSIBILISE: [],
        TOUS: [],
      });
      rechercheParBesoin.set(BesoinCyber.SECURISER);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('mss');
    });

    it("conserve tous les items en cas d'absence de besoins", () => {
      const repartition = {
        REAGIR: [],
        SE_FORMER: [],
        SECURISER: [],
        ETRE_SENSIBILISE: [],
        TOUS: ['/services/demainspecialistecyber', '/services/mss'],
      };
      catalogueStore.initialise([mss(), demainSpecialisteCyber()], repartition);
      rechercheParBesoin.set(null);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
      expect(resultats[0].id).toEqual('/services/demainspecialistecyber');
    });
  });

  describe("sur application d'un filtre d'accessibilité", () => {
    it('conserve uniquement les items correspondants', () => {
      initialiseStoreCatalogue([mss(), demainSpecialisteCyber()]);
      rechercheParDroitAcces.set([DroitAcces.ACCES_LIBRE]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('DemainSpécialisteCyber');
    });

    it("conserve tous les items en cas d'absence de droits d'acces", () => {
      initialiseStoreCatalogue([mss(), demainSpecialisteCyber()]);
      rechercheParDroitAcces.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre de typologie", () => {
    it('peut conserver uniquement les services', () => {
      initialiseStoreCatalogue([mss(), livretEnJeux()]);
      rechercheParTypologie.set([Typologie.SERVICE]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('mss');
    });

    it('conserve tous les items quand aucun filtre actif', () => {
      initialiseStoreCatalogue([mss(), livretEnJeux()]);
      rechercheParTypologie.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre de format", () => {
    it('conserve uniquement les items correspondant', () => {
      initialiseStoreCatalogue([livretEnJeux(), guidesTechniques()]);
      rechercheParFormat.set([FormatRessource.PUBLICATION]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('Guides techniques');
    });

    it('conserve tous les items quand aucun filtre actif', () => {
      initialiseStoreCatalogue([livretEnJeux(), guidesTechniques()]);
      rechercheParFormat.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe("sur application d'un filtre de source", () => {
    // d'autres tests plus spécifiques sont dans rechercheParSource.store.spec
    it('conserve uniquement les items correspondants', () => {
      initialiseStoreCatalogue([mss(), kitCyber()]);
      rechercheParSource.set([Source.PARTENAIRES]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('KIT CYBER');
    });

    it("conserve tous les items en cas d'absence de source", () => {
      initialiseStoreCatalogue([mss(), demainSpecialisteCyber()]);
      rechercheParSource.set([]);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(2);
    });
  });

  describe('sur limitation du nombre de résultats', () => {
    it('ne conserve que les x premiers éléments', () => {
      initialiseStoreCatalogue([mss(), demainSpecialisteCyber()]);
      limitationRecherche.set(1);

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
    });
  });

  describe('sur recherche textuelle', () => {
    it("filtre sur le nom de l'item", () => {
      initialiseStoreCatalogue([mss(), demainSpecialisteCyber()]);
      rechercheTextuelle.set('mss');

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('mss');
    });

    it('le filtre sur le nom peut être partiel', () => {
      initialiseStoreCatalogue([mss(), demainSpecialisteCyber()]);
      rechercheTextuelle.set('Demain');

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('DemainSpécialisteCyber');
    });

    it('le filtre est insensible à la casse', () => {
      initialiseStoreCatalogue([mss(), demainSpecialisteCyber()]);
      rechercheTextuelle.set('dEMAIN');

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('DemainSpécialisteCyber');
    });

    it('filtre sur la description', () => {
      initialiseStoreCatalogue([mss(), demainSpecialisteCyber()]);
      rechercheTextuelle.set('sécuriser');

      const { resultats } = get(catalogueFiltre);

      expect(resultats.length).toBe(1);
      expect(resultats[0].nom).toBe('mss');
    });
  });
});
