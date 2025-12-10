import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { BesoinCyber } from '../../../src/catalogue/Catalogue.types';
import { rechercheParBesoin } from '../../../src/catalogue/stores/rechercheParBesoin.store';
import { guideZeroTrust } from './objetsExemples';

describe('La recherche par besoin', () => {
  it('est vide quand on la réinitialise', () => {
    rechercheParBesoin.set(BesoinCyber.REAGIR);

    rechercheParBesoin.reinitialise();

    expect(get(rechercheParBesoin)).toBeNull();
  });

  describe("lorsqu'elle traite des guides", () => {
    it('retourne vrai lorsque le filtre correspond à un besoin du guide', () => {
      rechercheParBesoin.set(BesoinCyber.SE_FORMER);

      const resultat = rechercheParBesoin.ok(guideZeroTrust);

      expect(resultat).toBe(true);
    });

    it('retourne faux lorsque le filtre ne correspond à aucun besoin du guide', () => {
      rechercheParBesoin.set(BesoinCyber.REAGIR);

      const resultat = rechercheParBesoin.ok(guideZeroTrust);

      expect(resultat).toBe(false);
    });
    it('retourne vrai quand on la réinitialise', () => {
      rechercheParBesoin.set(BesoinCyber.REAGIR);

      rechercheParBesoin.reinitialise();
      const resultat = rechercheParBesoin.ok(guideZeroTrust);

      expect(resultat).toBe(true);
    });
    it('retourne vrai quand on filtre tous les besoins', () => {
      rechercheParBesoin.set(BesoinCyber.TOUS);

      const resultat = rechercheParBesoin.ok(guideZeroTrust);

      expect(resultat).toBe(true);
    });
  });
});
