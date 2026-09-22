import { describe, expect, it } from 'vitest';
import { envoieEmailCreationCompte } from '../../src/bus/envoieEmailCreationCompte.js';
import { CompteCree } from '../../src/bus/evenements/compteCree.js';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail.js';
import { fauxAdaptateurEmail } from '../api/fauxObjets.js';

describe("L'abonnement qui envoie un email de création de compte", () => {
  it('envoie un email de bienvenue', () => {
    let donneesRecues;
    const adaptateurEmail: AdaptateurEmail = {
      ...fauxAdaptateurEmail,
      envoieEmailBienvenue: async ({ email, prenom }) => {
        donneesRecues = { email, prenom };
      },
    };

    envoieEmailCreationCompte({ adaptateurEmail })(
      new CompteCree({
        email: 'jeanne.dupond@mail.fr',
        prenom: 'Jeanne',
        nom: 'Dupont',
        infoLettre: true,
        pixelDeSuiviAccepté: true,
      })
    );

    expect(donneesRecues).toBeDefined();
    expect(donneesRecues!.email).toBe('jeanne.dupond@mail.fr');
    expect(donneesRecues!.prenom).toBe('Jeanne');
  });
});
