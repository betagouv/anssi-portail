import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { rechercheParThematiqueNis2 } from '../../../src/nis2/stores/rechercheParThematiqueNis2';
import {
  exigenceISODeNiveauEleve,
  exigenceNIS2DeNiveauFaible as exigenceNIS2AvecThematiqueGouvernance,
  exigenceNIS2DeNiveauEleve as exigenceNIS2AvecThematiqueRecensement,
} from '../objetsPretsALEmploi';

describe('La recherche par thématique', () => {
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
        exigenceNIS2AvecThematiqueGouvernance()
      );

      expect(resultat).toBe(false);
    });

    it('en incluant une exigence comparée dont la thématique correspond', () => {
      rechercheParThematiqueNis2.set('Recensement');

      const resultat = rechercheParThematiqueNis2.ok(
        exigenceNIS2AvecThematiqueRecensement()
      );

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si il n'y pas de filtre actif", () => {
      const resultat = rechercheParThematiqueNis2.ok(
        exigenceNIS2AvecThematiqueRecensement()
      );

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si l'exigence source n'est pas une exigence NIS 2", () => {
      const resultat = rechercheParThematiqueNis2.ok(
        exigenceISODeNiveauEleve()
      );

      expect(resultat).toBe(true);
    });
  });
});
