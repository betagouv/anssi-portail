import { describe, expect, it } from 'vitest';
import { FormatRessource } from '../../../src/catalogue/Catalogue.types';
import { get } from 'svelte/store';
import { rechercheParFormat } from '../../../src/catalogue/stores/rechercheParFormat.store';

describe('La recherche par format', () => {
  it('est vide quand on la réinitialise', () => {
    rechercheParFormat.set([FormatRessource.PUBLICATION]);

    rechercheParFormat.reinitialise();

    expect(get(rechercheParFormat)).toEqual([]);
  });
});
