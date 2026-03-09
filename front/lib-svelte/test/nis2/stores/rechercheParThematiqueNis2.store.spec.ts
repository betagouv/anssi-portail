import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import type {
  ExigenceISO,
  ExigenceNis2,
} from '../../../src/nis2/exigence.type';
import { rechercheParThematiqueNis2 } from '../../../src/nis2/stores/rechercheParThematiqueNis2';

describe('La recherche par thématique', () => {
  const exigenceNIS2AvecThematiqueGouvernance: ExigenceNis2 = {
    reference: 'EX-01',
    contenu: "Contenu de l'exigence 1",
    thematique: 'Gouvernance',
    objectifSecurite:
      "Objectif de sécurité 5: Maitrise des systèmes d'information",
    entitesCible: [],
    correspondance: {
      niveau: 'faible',
      exigences: [],
      observations: '',
    },
  };
  const exigenceNIS2AvecThematiqueRecensement: ExigenceNis2 = {
    reference: 'EX-02',
    contenu: "Contenu de l'exigence 2",
    thematique: 'Recensement',
    objectifSecurite: "Objectif de sécurité 3: Maîtrise de l'écosystème",
    entitesCible: [],
    correspondance: {
      niveau: 'élevé',
      exigences: [],
      observations: '',
    },
  };
  const exigenceISO: ExigenceISO = {
    norme: 'ISO 27001',
    chapitre: '5.1',
    reference: '5.1 EX-02',
    contenu: "Contenu de l'exigence 2",
    correspondance: {
      niveau: 'élevé',
      exigences: [],
      observations: '',
    },
  };

  beforeEach(() => {
    rechercheParThematiqueNis2.reinitialise();
  });

  it('est vide quand on la réinitialise', () => {
    rechercheParThematiqueNis2.set('Recensement');

    rechercheParThematiqueNis2.reinitialise();

    expect(get(rechercheParThematiqueNis2)).toBeUndefined();
  });

  describe('permet de filtrer les exigences NIS2 comparées', () => {
    it('en rejetant une exigence comparée dont la thématique ne correspond pas', () => {
      rechercheParThematiqueNis2.set('Recensement');

      const resultat = rechercheParThematiqueNis2.ok(
        exigenceNIS2AvecThematiqueGouvernance
      );

      expect(resultat).toBe(false);
    });

    it('en incluant une exigence comparée dont la thématique correspond', () => {
      rechercheParThematiqueNis2.set('Recensement');

      const resultat = rechercheParThematiqueNis2.ok(
        exigenceNIS2AvecThematiqueRecensement
      );

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si il n'y pas de filtre actif", () => {
      const resultat = rechercheParThematiqueNis2.ok(
        exigenceNIS2AvecThematiqueRecensement
      );

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si l'exigence source n'est pas une exigence NIS 2", () => {
      const resultat = rechercheParThematiqueNis2.ok(exigenceISO);

      expect(resultat).toBe(true);
    });
  });
});
