import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { exigencesStore } from '../../../src/nis2/stores/exigences.store';
import { exigencesFiltrees } from '../../../src/nis2/stores/exigencesFiltrees.store';
import { rechercheParCorrespondance } from '../../../src/nis2/stores/rechercheParCorrespondance';
import type { Exigence } from '../../../src/nis2/exigence.type';
import { rechercheParEntiteNis2 } from '../../../src/nis2/stores/rechercheParEntiteNis2';
import { rechercheParObjectifNis2 } from '../../../src/nis2/stores/rechercheParObjectifNis2';
import { rechercheParThematiqueNis2 } from '../../../src/nis2/stores/rechercheParThematiqueNis2';

describe('Le store des exigences filtrées', () => {
  beforeEach(() => {
    get(exigencesFiltrees).reinitialise();
  });

  it('sait réinitialiser les filtres utilisés', () => {
    rechercheParCorrespondance.set('moyen');

    get(exigencesFiltrees).reinitialise();

    expect(get(rechercheParCorrespondance)).toBeUndefined();
    expect(get(rechercheParEntiteNis2)).toBeUndefined();
  });

  describe('lorsque le filtre de correspondance', () => {
    it("est valorisé, detecte qu'un filtre est actif", () => {
      rechercheParCorrespondance.set('moyen');

      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeTruthy();
    });

    it("n'est pas valorisé, detecte qu'aucun filtre n'est actif", () => {
      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeFalsy();
    });
  });

  describe("sur application d'un filtre de correspondance", () => {
    const exigencesDansLeStore: Exigence[] = [
      {
        reference: 'EX-01',
        contenu: "Contenu de l'exigence 1",
        norme: 'ISO 27001',
        chapitre: '5.1',
        correspondance: {
          niveau: 'faible',
          exigences: [],
          observations: '',
        },
      },
      {
        reference: 'EX-02',
        contenu: "Contenu de l'exigence 2",
        norme: 'ISO 27001',
        chapitre: '5.2',
        correspondance: {
          niveau: 'moyen',
          exigences: [],
          observations: '',
        },
      },
    ];

    it('conserve uniquement les exigences avec le même niveau de correspondances', () => {
      exigencesStore.initialise(exigencesDansLeStore);
      rechercheParCorrespondance.set('moyen');

      const { exigences } = get(exigencesFiltrees);

      expect(exigences.length).toBe(1);
      expect(exigences[0].reference).toBe('EX-02');
    });

    it("conserve tous les items en cas d'absence de besoins", () => {
      exigencesStore.initialise(exigencesDansLeStore);

      const { exigences } = get(exigencesFiltrees);

      expect(exigences.length).toBe(2);
      expect(exigences[0].reference).toBe('EX-01');
      expect(exigences[1].reference).toBe('EX-02');
    });
  });

  describe('lorsque le filtre des entités NIS 2', () => {
    it("est valorisé, detecte qu'un filtre est actif", () => {
      rechercheParEntiteNis2.set('EntiteImportante');

      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeTruthy();
    });

    it("n'est pas valorisé, detecte qu'aucun filtre n'est actif", () => {
      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeFalsy();
    });
  });

  describe('lorsque le filtre des objectifs de sécurité NIS 2', () => {
    it("est valorisé, detecte qu'un filtre est actif", () => {
      rechercheParObjectifNis2.set(
        "Objectif de sécurité 3: Maîtrise de l'écosystème"
      );

      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeTruthy();
    });

    it("n'est pas valorisé, detecte qu'aucun filtre n'est actif", () => {
      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeFalsy();
    });
  });

  describe('lorsque le filtre des thématiques NIS 2', () => {
    it("est valorisé, detecte qu'un filtre est actif", () => {
      rechercheParThematiqueNis2.set('Gouvernance');

      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeTruthy();
    });

    it("n'est pas valorisé, detecte qu'aucun filtre n'est actif", () => {
      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeFalsy();
    });
  });
});
