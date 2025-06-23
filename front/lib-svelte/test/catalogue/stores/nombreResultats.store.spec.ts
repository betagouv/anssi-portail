import { describe, expect, it } from 'vitest';
import {
  DroitAcces,
  FormatRessource,
  type ItemCyber,
  Source,
  Typologie,
} from '../../../src/catalogue/Catalogue.types';
import { nombreResultats } from '../../../src/catalogue/stores/nombreResultats.store';
import { get } from 'svelte/store';
import { catalogueStore } from '../../../src/catalogue/stores/catalogue.store';
import {
  demainSpecialisteCyber,
  guidesTechniques,
  kitCyber,
  livretEnJeux,
  monEspaceNIS2,
  mss,
} from './objetsExemples';

describe('Le store du nombre de résultats', () => {
  const initialiseStoreCatalogue = (tous: ItemCyber[]) => {
    catalogueStore.initialise(tous, {
      REAGIR: [],
      SE_FORMER: [],
      SECURISER: [],
      ETRE_SENSIBILISE: [],
      TOUS: tous.map((item) => item.id),
    });
  };
  describe("peut retourner le nombre par droit d'accès", () => {
    it('pour une entité publique', () => {
      initialiseStoreCatalogue([mss()]);

      const parDroitAcces = get(nombreResultats).parDroitAcces;

      expect(parDroitAcces[DroitAcces.ACCES_LIBRE]).toBe(0);
      expect(parDroitAcces[DroitAcces.ENTITES_PUBLIQUES]).toBe(1);
    });

    it('pour un accès libre', () => {
      initialiseStoreCatalogue([demainSpecialisteCyber()]);

      const parDroitAcces = get(nombreResultats).parDroitAcces;

      expect(parDroitAcces[DroitAcces.ACCES_LIBRE]).toBe(1);
      expect(parDroitAcces[DroitAcces.ENTITES_PUBLIQUES]).toBe(0);
    });

    it('pour une entité régulée / NIS2 qui est également en accès libre', () => {
      initialiseStoreCatalogue([monEspaceNIS2()]);

      const parDroitAcces = get(nombreResultats).parDroitAcces;

      expect(parDroitAcces[DroitAcces.ACCES_LIBRE]).toBe(1);
      expect(parDroitAcces[DroitAcces.ENTITES_PUBLIQUES]).toBe(0);
      expect(parDroitAcces[DroitAcces.REGULES_NIS2]).toBe(1);
    });

    it("lorsque un service n'a pas de droit d'acces", () => {
      const sansDroitAcces = monEspaceNIS2();
      // @ts-expect-error On simule ici un markdown invalide
      delete sansDroitAcces.droitsAcces;
      initialiseStoreCatalogue([sansDroitAcces]);

      const parDroitAcces = get(nombreResultats).parDroitAcces;

      expect(parDroitAcces[DroitAcces.ACCES_LIBRE]).toBe(0);
      expect(parDroitAcces[DroitAcces.ENTITES_PUBLIQUES]).toBe(0);
      expect(parDroitAcces[DroitAcces.REGULES_NIS2]).toBe(0);
    });
  });

  describe('peut retourner le nombre par typologie', () => {
    it('pour un service', () => {
      initialiseStoreCatalogue([mss()]);

      const parTypologie = get(nombreResultats).parTypologie;

      expect(parTypologie[Typologie.SERVICE]).toBe(1);
      expect(parTypologie[Typologie.RESSOURCE]).toBe(0);
    });

    it('pour une ressource', () => {
      initialiseStoreCatalogue([guidesTechniques()]);

      const parTypologie = get(nombreResultats).parTypologie;

      expect(parTypologie[Typologie.SERVICE]).toBe(0);
      expect(parTypologie[Typologie.RESSOURCE]).toBe(1);
    });
  });

  describe('peut retourner le nombre par format', () => {
    it('pour un pdf', () => {
      initialiseStoreCatalogue([guidesTechniques()]);

      const parFormatDeRessource = get(nombreResultats).parFormatDeRessource;

      expect(parFormatDeRessource[FormatRessource.PUBLICATION]).toBe(1);
      expect(parFormatDeRessource[FormatRessource.OUTIL]).toBe(0);
    });

    it('pour une vidéo', () => {
      initialiseStoreCatalogue([livretEnJeux()]);

      const parFormatDeRessource = get(nombreResultats).parFormatDeRessource;

      expect(parFormatDeRessource[FormatRessource.PUBLICATION]).toBe(0);
      expect(parFormatDeRessource[FormatRessource.OUTIL]).toBe(1);
    });
  });

  describe('peut retourner le nombre par source', () => {
    it('pour les partenaires', () => {
      initialiseStoreCatalogue([kitCyber()]);

      const parSource = get(nombreResultats).parSource;

      expect(parSource[Source.ANSSI]).toBe(0);
      expect(parSource[Source.PARTENAIRES]).toBe(1);
    });

    it("lorsque un service n'a pas de source", () => {
      const sansSource = monEspaceNIS2();
      delete sansSource.sources;
      initialiseStoreCatalogue([sansSource]);

      const parSource = get(nombreResultats).parSource;

      expect(parSource[Source.ANSSI]).toBe(0);
      expect(parSource[Source.PARTENAIRES]).toBe(0);
    });
  });
});
