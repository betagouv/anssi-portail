import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { exigencesStore } from '../../../src/nis2/stores/exigences.store';
import { exigencesFiltrees } from '../../../src/nis2/stores/exigencesFiltrees.store';
import { rechercheParCorrespondance } from '../../../src/nis2/stores/rechercheParCorrespondance';
import type { Exigence } from '../../../src/nis2/exigence.type';

describe('Le store des exigences filtrées', () => {
  beforeEach(() => {
    rechercheParCorrespondance.reinitialise();
  });

  describe("sur application d'un filtre de correspondance", () => {
    const exigences: Exigence[] = [
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
      exigencesStore.initialise(exigences);
      rechercheParCorrespondance.set('moyen');

      const resultats = get(exigencesFiltrees);

      expect(resultats.length).toBe(1);
      expect(resultats[0].reference).toBe('EX-02');
    });

    it("conserve tous les items en cas d'absence de besoins", () => {
      exigencesStore.initialise(exigences);

      const resultats = get(exigencesFiltrees);

      expect(resultats.length).toBe(2);
      expect(resultats[0].reference).toBe('EX-01');
      expect(resultats[1].reference).toBe('EX-02');
    });
  });
});
