import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Telephone } from '../../src/metier/telephone';

describe('Les numéros de télephone', () => {
  it('se déclinent en format international', () => {
    const telephoneFr = '0612345678';

    const telephoneInternational = new Telephone(telephoneFr).auFormatInternational();

    assert.equal(telephoneInternational, '+33612345678');
  });

  it("retourne une chaine vide si le telephone n'existe pas", () => {
    const telephoneInternational = new Telephone(undefined).auFormatInternational();

    assert.equal(telephoneInternational, '');
  });
});
