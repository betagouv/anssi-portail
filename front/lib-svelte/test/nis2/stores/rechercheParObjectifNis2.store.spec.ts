import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import type {
  ExigenceISO,
  ExigenceNis2,
} from '../../../src/nis2/exigence.type';
import { rechercheParObjectifNis2 } from '../../../src/nis2/stores/rechercheParObjectifNis2';

describe('La recherche par objectif de sécurité', () => {
  const exigenceNIS2DeNiveauFaible: ExigenceNis2 = {
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
  const exigenceNIS2DeNiveauEleve: ExigenceNis2 = {
    reference: 'EX-02',
    contenu: "Contenu de l'exigence 2",
    thematique: 'Gouvernance',
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
    rechercheParObjectifNis2.reinitialise();
  });

  it('est vide quand on la réinitialise', () => {
    rechercheParObjectifNis2.set(
      "Objectif de sécurité 3: Maîtrise de l'écosystème"
    );

    rechercheParObjectifNis2.reinitialise();

    expect(get(rechercheParObjectifNis2)).toBeUndefined();
  });

  describe('permet de filtrer les exigences NIS2 comparées', () => {
    it("en rejetant une exigence comparée dont l'objectif de sécurité ne correspond pas", () => {
      rechercheParObjectifNis2.set(
        "Objectif de sécurité 3: Maîtrise de l'écosystème"
      );

      const resultat = rechercheParObjectifNis2.ok(exigenceNIS2DeNiveauFaible);

      expect(resultat).toBe(false);
    });

    it("en incluant une exigence comparée dont l'objectif de sécurité correspond", () => {
      rechercheParObjectifNis2.set(
        "Objectif de sécurité 3: Maîtrise de l'écosystème"
      );

      const resultat = rechercheParObjectifNis2.ok(exigenceNIS2DeNiveauEleve);

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si il n'y pas de filtre actif", () => {
      const resultat = rechercheParObjectifNis2.ok(exigenceNIS2DeNiveauEleve);

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si l'exigence source n'est pas une exigence NIS 2", () => {
      const resultat = rechercheParObjectifNis2.ok(exigenceISO);

      expect(resultat).toBe(true);
    });
  });
});
