import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { rechercheParFonctionCyFun23 } from '../../../src/nis2/stores/rechercheParFonctionCyFun23';
import {
  exigenceCyFun23,
  exigenceISODeNiveauEleve,
} from '../objetsPretsALEmploi';

describe('La recherche par fonction', () => {
  beforeEach(() => {
    rechercheParFonctionCyFun23.reinitialise();
  });

  it('est vide quand on la réinitialise', () => {
    rechercheParFonctionCyFun23.set('Identifier');

    rechercheParFonctionCyFun23.reinitialise();

    expect(get(rechercheParFonctionCyFun23)).toBeUndefined();
  });

  describe('permet de filtrer les exigences CyFun23 comparées', () => {
    it('en rejetant une exigence comparée dont la fonction ne correspond pas', () => {
      rechercheParFonctionCyFun23.set('Protéger');

      const resultat = rechercheParFonctionCyFun23.ok(
        exigenceCyFun23({ fonction: 'Identifier' })
      );

      expect(resultat).toBe(false);
    });

    it('en incluant une exigence comparée dont la fonction correspond', () => {
      rechercheParFonctionCyFun23.set('Identifier');

      const resultat = rechercheParFonctionCyFun23.ok(
        exigenceCyFun23({ fonction: 'Identifier' })
      );

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si il n'y pas de filtre actif", () => {
      const resultat = rechercheParFonctionCyFun23.ok(exigenceCyFun23());

      expect(resultat).toBe(true);
    });

    it("en incluant une exigence comparée si l'exigence source n'est pas une exigence CyFun23", () => {
      rechercheParFonctionCyFun23.set('Identifier');

      const resultat = rechercheParFonctionCyFun23.ok(
        exigenceISODeNiveauEleve()
      );

      expect(resultat).toBe(true);
    });
  });
});
