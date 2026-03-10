import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { rechercheParObjectifNis2 } from '../../../src/nis2/stores/rechercheParObjectifNis2';
import {
  exigenceISODeNiveauEleve,
  exigenceNIS2DeNiveauEleve,
  exigenceNIS2DeNiveauFaible,
} from '../objetsPretsALEmploi';

describe('La recherche par objectif de sécurité', () => {
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

      const resultat = rechercheParObjectifNis2.ok(
        exigenceNIS2DeNiveauFaible()
      );

      expect(resultat).toBe(false);
    });

    it("en incluant une exigence comparée dont l'objectif de sécurité correspond", () => {
      rechercheParObjectifNis2.set(
        "Objectif de sécurité 3: Maîtrise de l'écosystème"
      );

      const resultat = rechercheParObjectifNis2.ok(exigenceNIS2DeNiveauEleve());

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si il n'y pas de filtre actif", () => {
      const resultat = rechercheParObjectifNis2.ok(exigenceNIS2DeNiveauEleve());

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si l'exigence source n'est pas une exigence NIS 2", () => {
      const resultat = rechercheParObjectifNis2.ok(exigenceISODeNiveauEleve());

      expect(resultat).toBe(true);
    });
  });
});
