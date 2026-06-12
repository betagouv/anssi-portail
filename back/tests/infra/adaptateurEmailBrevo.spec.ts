import { AxiosError } from 'axios';
import assert from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { adaptateurEmailBrevo } from '../../src/infra/adaptateurEmailBrevo';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail';

describe('L’adaptateur email Brevo', () => {
  describe('lorsqu’une erreur se produit', () => {
    let fnConsoleError: typeof console.error;
    let fnPostAxios: (_url: string) => Promise<never>;
    let brevo: AdaptateurEmail;

    beforeEach(() => {
      fnConsoleError = console.error;
      fnPostAxios = async (_url: string) => {
        throw new AxiosError('Une erreur s’est produite');
      };
      brevo = adaptateurEmailBrevo(fnPostAxios);
    });

    afterEach(() => {
      console.error = fnConsoleError;
    });

    describe('pour la création de contact', () => {
      const fauxContact = () => ({
        email: 'mail@example.com',
        prenom: 'Jeanne',
        nom: 'Dupont',
        infoLettre: true,
      });

      it('ne loggue pas l’erreur levée, loggue le message', async () => {
        let messageLog;
        console.error = (message) => (messageLog = message);
        try {
          await brevo.creeContactBrevo(fauxContact());
        } catch {
          assert.equal('Une erreur s’est produite', messageLog);
        }
      });

      it('ne loggue pas trop d’informations', async () => {
        let messagesLog: string[] = [];
        console.error = (...messages: unknown[]) => (messagesLog = messages.map((m) => JSON.stringify(m)));
        try {
          await brevo.creeContactBrevo(fauxContact());
        } catch {
          for (const message of messagesLog) {
            assert.ok(message.length < 100);
          }
        }
      });
    });
  });
});
