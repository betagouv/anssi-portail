import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { rechercheParNormeISO } from '../../../src/nis2/stores/rechercheParNormeISO';
import {
  exigenceISODeNiveauEleve,
  exigenceNIS2DeNiveauEleve,
} from '../objetsPretsALEmploi';

describe('La recherche par norme', () => {
  beforeEach(() => {
    rechercheParNormeISO.reinitialise();
  });

  it('est vide quand on la réinitialise', () => {
    rechercheParNormeISO.set('ISO 27001');

    rechercheParNormeISO.reinitialise();

    expect(get(rechercheParNormeISO)).toBeUndefined();
  });

  describe('permet de filtrer les exigences ISO', () => {
    it('en rejetant une exigence dont la norme ne correspond pas', () => {
      rechercheParNormeISO.set('ISO 27002');

      const resultat = rechercheParNormeISO.ok(exigenceISODeNiveauEleve());

      expect(resultat).toBe(false);
    });

    it('en incluant une exigence dont la norme correspond', () => {
      rechercheParNormeISO.set('ISO 27001');

      const resultat = rechercheParNormeISO.ok(exigenceISODeNiveauEleve());

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence si il n'y pas de filtre actif", () => {
      const resultat = rechercheParNormeISO.ok(exigenceISODeNiveauEleve());

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence si l'exigence source n'est pas une exigence ISO", () => {
      rechercheParNormeISO.set('ISO 27001');

      const resultat = rechercheParNormeISO.ok(exigenceNIS2DeNiveauEleve());

      expect(resultat).toBe(true);
    });
  });
});
