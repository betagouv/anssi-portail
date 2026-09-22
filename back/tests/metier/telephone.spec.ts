import { describe, expect, it } from 'vitest';
import { Telephone } from '../../src/metier/telephone.js';

describe('Les numéros de télephone', () => {
  it('se déclinent en format international', () => {
    const telephoneFr = '0612345678';

    const telephoneInternational = new Telephone(telephoneFr).auFormatInternational();

    expect(telephoneInternational).toBe('+33612345678');
  });

  it("retourne une chaine vide si le telephone n'existe pas", () => {
    const telephoneInternational = new Telephone(undefined).auFormatInternational();

    expect(telephoneInternational).toBe('');
  });
});
