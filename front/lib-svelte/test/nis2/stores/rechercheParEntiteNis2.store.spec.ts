import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import type {
  ExigenceISO,
  ExigenceNis2,
} from '../../../src/nis2/exigence.type';
import { rechercheParEntiteNis2 } from '../../../src/nis2/stores/rechercheParEntiteNis2';

describe('La recherche par entité', () => {
  const exigenceNIS2DeNiveauFaible: ExigenceNis2 = {
    reference: 'EX-01',
    contenu: "Contenu de l'exigence 1",
    thematique: 'Gouvernance',
    objectifSecurite: "Assurer la sécurité des systèmes d'information",
    entitesCible: ['EntiteEssentielle'],
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
    objectifSecurite: "Assurer la sécurité des systèmes d'information",
    entitesCible: ['EntiteEssentielle', 'EntiteImportante'],
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
    rechercheParEntiteNis2.reinitialise();
  });

  it('est vide quand on la réinitialise', () => {
    rechercheParEntiteNis2.set('EntiteImportante');

    rechercheParEntiteNis2.reinitialise();

    expect(get(rechercheParEntiteNis2)).toBeUndefined();
  });

  describe('permet de filtrer les exigences NIS2 comparées', () => {
    it("en rejetant une exigence comparée dont l'entité ne correspond pas", () => {
      rechercheParEntiteNis2.set('EntiteImportante');

      const resultat = rechercheParEntiteNis2.ok(exigenceNIS2DeNiveauFaible);

      expect(resultat).toBe(false);
    });

    it("en incluant une exigence comparée dont l'entité correspond", () => {
      rechercheParEntiteNis2.set('EntiteImportante');

      const resultat = rechercheParEntiteNis2.ok(exigenceNIS2DeNiveauEleve);

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si il n'y pas de filtre actif", () => {
      const resultat = rechercheParEntiteNis2.ok(exigenceNIS2DeNiveauEleve);

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si l'exigence source n'est pas une exigence NIS 2", () => {
      const resultat = rechercheParEntiteNis2.ok(exigenceISO);

      expect(resultat).toBe(true);
    });
  });
});
