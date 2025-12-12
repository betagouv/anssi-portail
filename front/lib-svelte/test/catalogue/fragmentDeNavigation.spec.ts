import { describe, expect, it } from 'vitest';
import { creeLeFragmentDeNavigation } from '../../src/catalogue/fragmentDeNavigation';
import { Langue } from '../../src/catalogue/Guide.types';
import { BesoinCyber } from '../../src/catalogue/Catalogue.types';

describe('Le fragment de navigation', () => {
  it('permet de récupérer la section', () => {
    const fragmentDeNavigation = creeLeFragmentDeNavigation('#section');

    expect(fragmentDeNavigation.section).toBe('section');
  });

  it('gère un fragment vide', () => {
    const fragmentDeNavigation = creeLeFragmentDeNavigation('');

    expect(fragmentDeNavigation.section).toBe(undefined);
  });

  it("récupère les valeurs typées d'un filtre", () => {
    const fragmentDeNavigation = creeLeFragmentDeNavigation('#?langues=EN,FR');

    const langues = fragmentDeNavigation.extraisTableau<Langue>('langues');

    expect(langues).toEqual([Langue.EN, Langue.FR]);
  });

  it("récupère une valeur typée d'un filtre", () => {
    const fragmentDeNavigation = creeLeFragmentDeNavigation('#?besoin=REAGIR');

    const besoin = fragmentDeNavigation.extraisValeur<BesoinCyber>('besoin');

    expect(besoin).toEqual(BesoinCyber.REAGIR);
  });

  describe("lorsque le filtre n'existe pas", () => {
    it('récupère un tableau vide', () => {
      const fragmentDeNavigation = creeLeFragmentDeNavigation('#');

      const langues = fragmentDeNavigation.extraisTableau<Langue>('langues');

      expect(langues).toEqual([]);
    });

    it('récupère une valeur indéfinie', () => {
      const fragmentDeNavigation = creeLeFragmentDeNavigation('#');

      const besoin = fragmentDeNavigation.extraisValeur<BesoinCyber>('besoin');

      expect(besoin).toEqual(undefined);
    });

    it('retourne la valeur par défaut', () => {
      const fragmentDeNavigation = creeLeFragmentDeNavigation('#');

      const besoin: BesoinCyber | null =
        fragmentDeNavigation.extraisValeur<BesoinCyber>('besoin', null);

      expect(besoin).toEqual(null);
    });

    it('retourne la valeur par défaut de type string', () => {
      const fragmentDeNavigation = creeLeFragmentDeNavigation('#');

      const rechercheTextuel: string =
        fragmentDeNavigation.extraisValeur<string>('q', '');

      expect(rechercheTextuel).toEqual('');
    });
  });

  it('sérialise le fragment de navigation', () => {
    const fragmentDeNavigation = creeLeFragmentDeNavigation(
      '#section?besoin=REAGIR&langues=EN,FR'
    );

    const versionSerialisee = fragmentDeNavigation.serialise();

    expect(versionSerialisee).toBe('#section?besoin=REAGIR&langues=EN,FR');
  });

  it('modifie le filtre avec une seule valeur', () => {
    const fragmentDeNavigation = creeLeFragmentDeNavigation('#?besoin=REAGIR');

    fragmentDeNavigation.change('besoin', BesoinCyber.SECURISER);

    expect(fragmentDeNavigation.extraisValeur<BesoinCyber>('besoin')).toBe(
      BesoinCyber.SECURISER
    );
  });

  it('modifie le filtre avec plusieurs valeurs', () => {
    const fragmentDeNavigation = creeLeFragmentDeNavigation('#?langues=FR');

    fragmentDeNavigation.change('langues', [Langue.EN, Langue.FR]);

    expect(fragmentDeNavigation.extraisTableau<Langue>('langues')).toEqual([
      Langue.EN,
      Langue.FR,
    ]);
  });

  describe("lorsqu'on affecte une valeur vide", () => {
    it('supprime le filtre de type tableau', () => {
      const fragmentDeNavigation = creeLeFragmentDeNavigation('#?langues=FR');

      fragmentDeNavigation.change('langues', []);

      expect(fragmentDeNavigation.serialise()).toEqual('#');
    });

    it('supprime le filtre de type chaine', () => {
      const fragmentDeNavigation =
        creeLeFragmentDeNavigation('#?besoin=REAGIR');

      fragmentDeNavigation.change('besoin', null);

      expect(fragmentDeNavigation.serialise()).toEqual('#');
    });
  });

  it('permet de modifier la section', () => {
    const fragmentDeNavigation = creeLeFragmentDeNavigation('#section');

    fragmentDeNavigation.changeSection('autre-section');

    expect(fragmentDeNavigation.serialise()).toBe('#autre-section');
  });
});
