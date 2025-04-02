import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail';
import { envoieEmailCreationCompte } from '../../src/bus/envoieEmailCreationCompte';
import { CompteCree } from '../../src/bus/compteCree';

describe("L'abonnement qui envoie un email de création de compte", () => {
  it('envoie un email de bienvenue', () => {
    let donneesRecues;
    const adaptateurEmail: AdaptateurEmail = {
      envoieEmailBienvenue: async ({ email, prenom }) => {
        donneesRecues = { email, prenom };
      },
    };

    envoieEmailCreationCompte({ adaptateurEmail })(
      new CompteCree({
        email: 'jeanne.dupond@mail.fr',
        prenom: 'Jeanne',
      })
    );

    assert.notEqual(donneesRecues, undefined);
    assert.equal(donneesRecues!.email, 'jeanne.dupond@mail.fr');
    assert.equal(donneesRecues!.prenom, 'Jeanne');
  });
});
