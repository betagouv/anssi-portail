import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import type { RésuméFinancement } from '../../../src/financements/financement';
import { rechercheParRegion } from '../../../src/financements/stores/rechercheParRegion.store';

describe('La recherche par région', () => {
  const résuméFinancement: RésuméFinancement = {
    entitésÉligibles: ['PME'],
    financeur: 'BPI',
    id: 1,
    nom: 'Aide Cyber',
    périmètresGéographiques: ['Ile-de-France'],
    typesDeFinancement: ['Formation'],
    régions: ['FR-IDF'],
  };
  beforeEach(() => {
    rechercheParRegion.reinitialise();
  });
  it('est vide quand on la réinitialise', () => {
    rechercheParRegion.set('FR-IDF');

    rechercheParRegion.reinitialise();

    expect(get(rechercheParRegion)).toEqual('');
  });

  describe('permet de filtrer les financements', () => {
    it('en rejetant un financement dont le type de financement ne correspond pas', () => {
      rechercheParRegion.set('FR-HDF');

      const resultat = rechercheParRegion.ok(résuméFinancement);

      expect(resultat).toBeFalsy();
    });

    it('en incluant un financement dont le type de financement correspond', () => {
      rechercheParRegion.set('FR-IDF');

      const resultat = rechercheParRegion.ok(résuméFinancement);

      expect(resultat).toBeTruthy();
    });

    it("en incluant un financement si il n'y pas de filtre actif", () => {
      const resultat = rechercheParRegion.ok(résuméFinancement);

      expect(resultat).toBeTruthy();
    });

    it("en incluant un financement qui concerne la France lorsqu'une région est séléctionnée", () => {
      rechercheParRegion.set('FR-IDF');

      const resultat = rechercheParRegion.ok({
        ...résuméFinancement,
        régions: ['FRANCE'],
      });

      expect(resultat).toBeTruthy();
    });
  });
});
