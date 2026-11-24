import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import type { RésuméFinancement } from '../../../src/financements/financement';
import { rechercheParTypeOrganisation } from '../../../src/financements/stores/rechercheParTypeOrganisation.store';

describe("La recherche par type d'organisation", () => {
  const résuméFinancement: RésuméFinancement = {
    entitésÉligibles: ['PME'],
    financeur: 'BPI',
    id: 1,
    nom: 'Aide Cyber',
    périmètresGéographiques: ['France'],
    typesDeFinancement: ['Formation'],
    régions: ['FRANCE'],
  };
  beforeEach(() => {
    rechercheParTypeOrganisation.reinitialise();
  });

  it('est vide quand on la réinitialise', () => {
    rechercheParTypeOrganisation.set(['PME']);

    rechercheParTypeOrganisation.reinitialise();

    expect(get(rechercheParTypeOrganisation)).toHaveLength(0);
  });

  describe('permet de filtrer les financements', () => {
    it("en rejetant un financement dont le type d'organisation ne correspond pas", () => {
      rechercheParTypeOrganisation.set(['ETI']);

      const resultat = rechercheParTypeOrganisation.ok(résuméFinancement);

      expect(resultat).toBe(false);
    });

    it("en incluant un financement dont le type d'organisation correspond", () => {
      rechercheParTypeOrganisation.set(['PME', 'ETI']);

      const resultat = rechercheParTypeOrganisation.ok(résuméFinancement);

      expect(resultat).toBe(true);
    });

    it("en incluant un financement si il n'y pas de filtre actif", () => {
      const resultat = rechercheParTypeOrganisation.ok(résuméFinancement);

      expect(resultat).toBe(true);
    });
  });
});
