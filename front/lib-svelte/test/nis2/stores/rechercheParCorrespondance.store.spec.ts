import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { rechercheParCorrespondance } from '../../../src/nis2/stores/rechercheParCorrespondance';
import type {
  ExigenceISO,
  ExigenceNis2,
} from '../../../src/nis2/exigence.type';

describe('La recherche par correspondance', () => {
  const exigenceNIS2DeNiveauFaible: ExigenceNis2 = {
    reference: 'EX-01',
    contenu: "Contenu de l'exigence 1",
    thematique: 'Gouvernance',
    objectifSecurite: "Assurer la sécurité des systèmes d'information",
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
    objectifSecurite: "Assurer la sécurité des systèmes d'information",
    entitesCible: [],
    correspondance: {
      niveau: 'élevé',
      exigences: [],
      observations: '',
    },
  };
  const exigenceISODeNiveauEleve: ExigenceISO = {
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
    rechercheParCorrespondance.reinitialise();
  });

  it('est vide quand on la réinitialise', () => {
    rechercheParCorrespondance.set('élevé');

    rechercheParCorrespondance.reinitialise();

    expect(get(rechercheParCorrespondance)).toBeUndefined();
  });

  describe('permet de filtrer les exigences NIS2 comparées', () => {
    it('en rejetant une exigence comparée dont le niveau de correspondance ne correspond pas', () => {
      rechercheParCorrespondance.set('élevé');

      const resultat = rechercheParCorrespondance.ok(
        exigenceNIS2DeNiveauFaible
      );

      expect(resultat).toBe(false);
    });

    it('en incluant une exigence comparée dont le niveau de correspondance correspond', () => {
      rechercheParCorrespondance.set('élevé');

      const resultat = rechercheParCorrespondance.ok(exigenceNIS2DeNiveauEleve);

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si il n'y pas de filtre actif", () => {
      const resultat = rechercheParCorrespondance.ok(exigenceNIS2DeNiveauEleve);

      expect(resultat).toBe(true);
    });
  });

  describe("permet de filtrer les autres types d'exigences comparées", () => {
    it('en incluant une exigence comparée dont le niveau de correspondance correspond', () => {
      rechercheParCorrespondance.set('élevé');

      const resultat = rechercheParCorrespondance.ok(exigenceISODeNiveauEleve);

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si il n'y pas de filtre actif", () => {
      const resultat = rechercheParCorrespondance.ok(exigenceISODeNiveauEleve);

      expect(resultat).toBe(true);
    });
  });
});
