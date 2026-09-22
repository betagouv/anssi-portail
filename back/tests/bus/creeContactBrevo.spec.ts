import { describe, expect, it } from 'vitest';
import { creeContactBrevo } from '../../src/bus/creeContactBrevo.js';
import { CompteCree } from '../../src/bus/evenements/compteCree.js';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail.js';
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
        pixelDeSuiviAccepté: boolean;
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

    expect(contactCree).toBeDefined();
    expect(contactCree).toEqual({
      email: 'jeanne.dupond@mail.fr',
      prenom: 'Jeanne',
      nom: 'Dupont',
      infoLettre: true,
      pixelDeSuiviAccepté: true,
      telephone: '0123456789',
    });
  });
});
