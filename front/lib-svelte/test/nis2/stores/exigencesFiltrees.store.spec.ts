import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { exigencesStore } from '../../../src/nis2/stores/exigences.store';
import { exigencesFiltrees } from '../../../src/nis2/stores/exigencesFiltrees.store';
import { rechercheParCorrespondance } from '../../../src/nis2/stores/rechercheParCorrespondance';
import type { Exigence } from '../../../src/nis2/exigence.type';
import { rechercheParEntiteNis2 } from '../../../src/nis2/stores/rechercheParEntiteNis2';
import { rechercheParObjectifNis2 } from '../../../src/nis2/stores/rechercheParObjectifNis2';
import { rechercheParThematiqueNis2 } from '../../../src/nis2/stores/rechercheParThematiqueNis2';
import {
  exigenceISODeNiveauEleve,
  exigenceNIS2DeNiveauEleve,
  exigenceNIS2DeNiveauFaible,
} from '../objetsPretsALEmploi';
import { rechercheParNormeISO } from '../../../src/nis2/stores/rechercheParNormeISO';

describe('Le store des exigences filtrées', () => {
  beforeEach(() => {
    get(exigencesFiltrees).reinitialise();
  });

  it('sait réinitialiser les filtres utilisés', () => {
    rechercheParCorrespondance.set('moyen');
    rechercheParEntiteNis2.set('EntiteEssentielle');
    rechercheParObjectifNis2.set('Un objectif');
    rechercheParThematiqueNis2.set('une thématique');
    rechercheParNormeISO.set('ISO 27001');

    get(exigencesFiltrees).reinitialise();

    expect(get(rechercheParCorrespondance)).toBeUndefined();
    expect(get(rechercheParEntiteNis2)).toBeUndefined();
    expect(get(rechercheParObjectifNis2)).toBeUndefined();
    expect(get(rechercheParThematiqueNis2)).toBeUndefined();
    expect(get(rechercheParNormeISO)).toBeUndefined();
  });

  it("n'est pas valorisé, detecte qu'aucun filtre n'est actif", () => {
    const filtresActifs = get(exigencesFiltrees).filtresActifs;

    expect(filtresActifs).toBeFalsy();
  });

  describe('lorsque le filtre de correspondance', () => {
    it("est valorisé, detecte qu'un filtre est actif", () => {
      rechercheParCorrespondance.set('moyen');

      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeTruthy();
    });

    it('est appliqué, conserve uniquement les exigences avec le même niveau de correspondances', () => {
      const exigencesDansLeStore: Exigence[] = [
        exigenceNIS2DeNiveauFaible(),
        {
          ...exigenceNIS2DeNiveauEleve(),
          correspondance: {
            niveau: 'moyen',
            exigences: [],
            observations: '',
          },
        },
      ];

      exigencesStore.initialise(exigencesDansLeStore);
      rechercheParCorrespondance.set('moyen');

      const { exigences } = get(exigencesFiltrees);

      expect(exigences.length).toBe(1);
      expect(exigences[0].reference).toBe('EX-02');
    });
  });

  describe('lorsque le filtre des entités NIS 2', () => {
    it("est valorisé, detecte qu'un filtre est actif", () => {
      rechercheParEntiteNis2.set('EntiteImportante');

      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeTruthy();
    });

    it("est appliqué, conserve uniquement les exigences avec le même type d'entité", () => {
      const exigencesDansLeStore: Exigence[] = [
        exigenceNIS2DeNiveauFaible(),
        exigenceNIS2DeNiveauEleve(),
      ];

      exigencesStore.initialise(exigencesDansLeStore);
      rechercheParEntiteNis2.set('EntiteImportante');

      const { exigences } = get(exigencesFiltrees);

      expect(exigences.length).toBe(1);
      expect(exigences[0].reference).toBe('EX-02');
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

    it('est appliqué, conserve uniquement les exigences avec le même objectif de sécurité', () => {
      const exigencesDansLeStore: Exigence[] = [
        exigenceNIS2DeNiveauFaible(),
        exigenceNIS2DeNiveauEleve(),
      ];

      exigencesStore.initialise(exigencesDansLeStore);
      rechercheParObjectifNis2.set(
        "Objectif de sécurité 3: Maîtrise de l'écosystème"
      );

      const { exigences } = get(exigencesFiltrees);

      expect(exigences.length).toBe(1);
      expect(exigences[0].reference).toBe('EX-02');
    });
  });

  describe('lorsque le filtre des thématiques NIS 2', () => {
    it("est valorisé, detecte qu'un filtre est actif", () => {
      rechercheParThematiqueNis2.set('Gouvernance');

      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeTruthy();
    });

    it('est appliqué, conserve uniquement les exigences avec la même thématique', () => {
      const exigencesDansLeStore: Exigence[] = [
        exigenceNIS2DeNiveauFaible(),
        exigenceNIS2DeNiveauEleve(),
      ];

      exigencesStore.initialise(exigencesDansLeStore);
      rechercheParThematiqueNis2.set('Recensement');

      const { exigences } = get(exigencesFiltrees);

      expect(exigences.length).toBe(1);
      expect(exigences[0].reference).toBe('EX-02');
    });
  });

  describe('lorsque le filtre des normes ISO', () => {
    it("est valorisé, detecte qu'un filtre est actif", () => {
      rechercheParNormeISO.set('ISO 27001');

      const filtresActifs = get(exigencesFiltrees).filtresActifs;

      expect(filtresActifs).toBeTruthy();
    });

    it('est appliqué, conserve uniquement les exigences avec la même norme', () => {
      const exigencesDansLeStore: Exigence[] = [
        exigenceISODeNiveauEleve(),
        {
          ...exigenceISODeNiveauEleve(),
          reference: '5.2 EX-02',
          norme: 'ISO 27002',
        },
      ];

      exigencesStore.initialise(exigencesDansLeStore);
      rechercheParNormeISO.set('ISO 27002');

      const { exigences } = get(exigencesFiltrees);

      expect(exigences.length).toBe(1);
      expect(exigences[0].reference).toBe('5.2 EX-02');
    });
  });
});
