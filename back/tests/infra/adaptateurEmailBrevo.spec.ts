import { AxiosError } from 'axios';
import assert from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { adaptateurEmailBrevo } from '../../src/infra/adaptateurEmailBrevo.js';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail.js';

describe('L’adaptateur email Brevo', () => {
  let fnPostAxios: (_url: string) => Promise<void>;
  let brevo: AdaptateurEmail;
  let postAxiosAppele: boolean = false;

  const fauxContact = () => ({
    email: 'mail@example.com',
    prenom: 'Jeanne',
    nom: 'Dupont',
    infoLettre: true,
  });

  beforeEach(() => {
    postAxiosAppele = false;
    fnPostAxios = async (_url: string) => {
      postAxiosAppele = true;
    };
    brevo = adaptateurEmailBrevo(fnPostAxios);
  });

  describe('pour la création de contact', () => {
    it('poste un message à axios', async () => {
      await brevo.creeContactBrevo(fauxContact());

      assert.equal(true, postAxiosAppele);
    });
  });

  describe('pour l’inscription à l’infolettre', () => {
    it('poste un message à axios', async () => {
      await brevo.inscrisAInfolettre('email');

      assert.equal(true, postAxiosAppele);
    });
  });

  describe('lorsqu’une erreur se produit', () => {
    let fnConsoleError: typeof console.error;

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
      it('ne loggue pas l’erreur levée, loggue le message', async () => {
        let messageLog;
        console.error = (message) => (messageLog = message);
        try {
          await brevo.creeContactBrevo(fauxContact());
          assert.fail();
        } catch {
          assert.equal('Une erreur s’est produite', messageLog);
        }
      });

      it('ne loggue pas trop d’informations', async () => {
        let messagesLog: string[] = [];
        console.error = (...messages: unknown[]) => (messagesLog = messages.map((m) => JSON.stringify(m)));
        try {
          await brevo.creeContactBrevo(fauxContact());
          assert.fail();
        } catch {
          for (const message of messagesLog) {
            assert.ok(message.length < 100);
          }
        }
      });
    });

    describe('pour l’inscription à l’infolettre', () => {
      it('ne loggue pas l’erreur levée, loggue le message', async () => {
        let messageLog;
        console.error = (message) => (messageLog = message);
        try {
          await brevo.inscrisAInfolettre('email');
          assert.fail();
        } catch {
          assert.equal('Une erreur s’est produite', messageLog);
        }
      });

      it('ne loggue pas trop d’informations', async () => {
        let messagesLog: string[] = [];
        console.error = (...messages: unknown[]) => (messagesLog = messages.map((m) => JSON.stringify(m)));
        try {
          await brevo.inscrisAInfolettre('email');
          assert.fail();
        } catch {
          for (const message of messagesLog) {
            assert.ok(message.length < 100);
          }
        }
      });
    });
  });
});
