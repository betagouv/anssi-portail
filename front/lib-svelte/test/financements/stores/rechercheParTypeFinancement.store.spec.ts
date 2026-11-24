import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import type { RésuméFinancement } from '../../../src/financements/financement';
import { rechercheParTypeFinancement } from '../../../src/financements/stores/rechercheParTypeFinancement.store';

describe('La recherche par type de financement', () => {
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
    rechercheParTypeFinancement.reinitialise();
  });

  it('est vide quand on la réinitialise', () => {
    rechercheParTypeFinancement.set(["Aide à l'innovation cyber"]);

    rechercheParTypeFinancement.reinitialise();

    expect(get(rechercheParTypeFinancement)).toHaveLength(0);
  });

  describe('permet de filtrer les financements', () => {
    it('en rejetant un financement dont le type de financement ne correspond pas', () => {
      rechercheParTypeFinancement.set(["Aide à l'innovation cyber"]);

      const resultat = rechercheParTypeFinancement.ok(résuméFinancement);

      expect(resultat).toBe(false);
    });

    it('en incluant un financement dont le type de financement correspond', () => {
      rechercheParTypeFinancement.set(['Formation', "Aide à l'innovation cyber"]);

      const resultat = rechercheParTypeFinancement.ok(résuméFinancement);

      expect(resultat).toBe(true);
    });

    it("en incluant un financement si il n'y pas de filtre actif", () => {
      const resultat = rechercheParTypeFinancement.ok(résuméFinancement);

      expect(resultat).toBe(true);
    });
  });
});
