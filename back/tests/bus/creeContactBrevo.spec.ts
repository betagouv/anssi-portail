import { describe, it } from 'node:test';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail.js';
import { creeContactBrevo } from '../../src/bus/creeContactBrevo.js';
import assert from 'assert';
import { CompteCree } from '../../src/bus/evenements/compteCree.js';
import { fauxAdaptateurEmail } from '../api/fauxObjets.js';

describe("L'abonnement qui crée un contact Brevo", () => {
  it('crée un contact dans Brevo', () => {
    let contactCree;
    const adaptateurEmail: AdaptateurEmail = {
      ...fauxAdaptateurEmail,
      creeContactBrevo: async (donneesRecues: {
        email: string;
        nom: string;
        prenom: string;
        infoLettre: boolean;
        telephone?: string;
      }) => {
        contactCree = { ...donneesRecues };
      },
    };

    creeContactBrevo({ adaptateurEmail })(
      new CompteCree({
        email: 'jeanne.dupond@mail.fr',
        prenom: 'Jeanne',
        nom: 'Dupont',
        infoLettre: true,
        pixelDeSuiviAccepté: true,
        telephone: '0123456789',
      })
    );

    assert.notEqual(contactCree, undefined);
    assert.deepEqual(contactCree, {
      email: 'jeanne.dupond@mail.fr',
      prenom: 'Jeanne',
      nom: 'Dupont',
      infoLettre: true,
      telephone: '0123456789',
    });
  });
});
