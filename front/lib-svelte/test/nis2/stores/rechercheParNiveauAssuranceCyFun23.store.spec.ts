import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { rechercheParNiveauAssuranceCyFun23 } from '../../../src/nis2/stores/rechercheParNiveauAssuranceCyFun23';
import {
  exigenceCyFun23,
  exigenceISODeNiveauEleve,
} from '../objetsPretsALEmploi';

describe("La recherche par niveau d'assurance", () => {
  beforeEach(() => {
    rechercheParNiveauAssuranceCyFun23.reinitialise();
  });

  it('est vide quand on la réinitialise', () => {
    rechercheParNiveauAssuranceCyFun23.set('Basique');

    rechercheParNiveauAssuranceCyFun23.reinitialise();

    expect(get(rechercheParNiveauAssuranceCyFun23)).toBeUndefined();
  });

  describe('permet de filtrer les exigences CyFun23 comparées', () => {
    it("en rejetant une exigence comparée dont le niveau d'assurance ne correspond pas", () => {
      rechercheParNiveauAssuranceCyFun23.set('Essentiel');

      const resultat = rechercheParNiveauAssuranceCyFun23.ok(
        exigenceCyFun23({ niveauAssurance: 'Basique' })
      );

      expect(resultat).toBe(false);
    });

    it("en incluant une exigence comparée dont le niveau d'assurance correspond", () => {
      rechercheParNiveauAssuranceCyFun23.set('Basique');

      const resultat = rechercheParNiveauAssuranceCyFun23.ok(
        exigenceCyFun23({ niveauAssurance: 'Basique' })
      );

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si il n'y pas de filtre actif", () => {
      const resultat = rechercheParNiveauAssuranceCyFun23.ok(exigenceCyFun23());

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si l'exigence source n'est pas une exigence CyFun23", () => {
      rechercheParNiveauAssuranceCyFun23.set('Basique');

      const resultat = rechercheParNiveauAssuranceCyFun23.ok(
        exigenceISODeNiveauEleve()
      );

      expect(resultat).toBe(true);
    });
  });
});
