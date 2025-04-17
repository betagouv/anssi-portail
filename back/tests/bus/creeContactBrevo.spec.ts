import { describe, it } from 'node:test';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail';
import { creeContactBrevo } from '../../src/bus/creeContactBrevo';
import assert from 'assert';
import { CompteCree } from '../../src/bus/evenements/compteCree';

describe("L'abonnement qui crée un contact Brevo", () => {
  it('crée un contact dans Brevo', () => {
    let contactCree;
    const adaptateurEmail: AdaptateurEmail = {
      envoieEmailBienvenue: async () => {},
      creeContactBrevo: async (donneesRecu: {
        email: string;
        nom: string;
        prenom: string;
        infoLettre: boolean;
      }) => {
        contactCree = { ...donneesRecu };
      },
    };

    creeContactBrevo({ adaptateurEmail })(
      new CompteCree({
        email: 'jeanne.dupond@mail.fr',
        prenom: 'Jeanne',
        nom: 'Dupont',
        infoLettre: true,
      })
    );

    assert.notEqual(contactCree, undefined);
    assert.deepEqual(contactCree, {
      email: 'jeanne.dupond@mail.fr',
      prenom: 'Jeanne',
      nom: 'Dupont',
      infoLettre: true,
    });
  });
});
