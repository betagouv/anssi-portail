import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { rechercheParEntiteNis2 } from '../../../src/nis2/stores/rechercheParEntiteNis2';
import {
  exigenceISODeNiveauEleve,
  exigenceNIS2DeNiveauEleve,
  exigenceNIS2DeNiveauFaible,
} from '../objetsPretsALEmploi';

describe('La recherche par entité', () => {
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

      const resultat = rechercheParEntiteNis2.ok(exigenceNIS2DeNiveauFaible());

      expect(resultat).toBe(false);
    });

    it("en incluant une exigence comparée dont l'entité correspond", () => {
      rechercheParEntiteNis2.set('EntiteImportante');

      const resultat = rechercheParEntiteNis2.ok(exigenceNIS2DeNiveauEleve());

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si il n'y pas de filtre actif", () => {
      const resultat = rechercheParEntiteNis2.ok(exigenceNIS2DeNiveauEleve());

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si l'exigence source n'est pas une exigence NIS 2", () => {
      const resultat = rechercheParEntiteNis2.ok(exigenceISODeNiveauEleve());

      expect(resultat).toBe(true);
    });
  });
});
