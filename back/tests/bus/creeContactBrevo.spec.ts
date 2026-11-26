import { describe, expect, it } from 'vitest';
import { AdaptateurEmail } from '@metier/adaptateurEmail.js';
import { creeContactBrevo } from '@bus/creeContactBrevo.js';
import { CompteCree } from '@bus/evenements/compteCree.js';
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
