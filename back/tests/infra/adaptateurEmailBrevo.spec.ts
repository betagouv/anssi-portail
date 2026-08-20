import { AxiosError } from '@anssi-portail/axios';
import assert from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { MesureConsultee } from '../../src/bus/evenements/mesureConsultee.js';
import { adaptateurEmailBrevo, DonnéesUtilisateurBrevo } from '../../src/infra/adaptateurEmailBrevo.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { ClientHttp } from '../../src/infra/clientHttp.js';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail.js';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';
import { fabriqueClientPost, fabriqueClientPut, fabriqueFauxClientHttp } from './fournisseurClientHttp.js';
import { MesurePriseEnCompte } from '../../src/bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '../../src/bus/evenements/moduleTermine.js';
import { BadgeCyberdépartDébloqué } from '../../src/bus/evenements/badgeCyberdepartDebloque.js';
import { ParcoursRejoint } from '../../src/bus/evenements/parcoursRejoint.js';

describe('L’adaptateur email Brevo', () => {
  let clientHttp: ClientHttp;
  let brevo: AdaptateurEmail;
  let postAxiosAppele: boolean = false;
  let donnéesPutAppelées: DonnéesUtilisateurBrevo;
  let urlPutAppelée: unknown;

  const fauxContact = () => ({
    email: 'mail@example.com',
    prenom: 'Jeanne',
    nom: 'Dupont',
    infoLettre: true,
    pixelDeSuiviAccepté: true,
  });

  const adaptateurHorloge: AdaptateurHorloge = {
    maintenant: () => new Date('2025-03-10'),
  };

  beforeEach(() => {
    postAxiosAppele = false;
    donnéesPutAppelées = {
      email: '',
      attributes: {},
    };
    urlPutAppelée = '';

    clientHttp = {
      ...fabriqueFauxClientHttp(),
      post: fabriqueClientPost(async (_url: string) => {
        postAxiosAppele = true;
      }),
      put: fabriqueClientPut(async (url: string, données: unknown) => {
        donnéesPutAppelées = données as DonnéesUtilisateurBrevo;
        urlPutAppelée = url;
      }),
    };

    brevo = adaptateurEmailBrevo({
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
      adaptateurHorloge,
    });
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
      clientHttp = {
        ...fabriqueFauxClientHttp(),
        post: fabriqueClientPost(async (_url: string) => {
          throw new AxiosError('Une erreur s’est produite');
        }),
      };
      brevo = adaptateurEmailBrevo({
        clientHttp,
        adaptateurEnvironnement: fauxAdaptateurEnvironnement,
        adaptateurHorloge,
      });
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

  describe('lors de la mise à jour des informations liées au parcours de sécurisation', () => {
    it("mets à jour la date de dernière consultation d'une mesure", async () => {
      await brevo.metsÀJourMesureConsultée(new MesureConsultee('mesure.consultee@mail.com', 'AUTH.5'));

      assert.equal(urlPutAppelée, 'FAUSSE_URL_BREVO/contacts/mesure.consultee@mail.com');
      assert.deepEqual(donnéesPutAppelées, {
        attributes: {
          DATE_DERNIERE_CONSULTATION_MESURE: new Date('2025-03-10'),
        },
      });
    });

    it("mets à jour la date de dernière prise en compte d'une mesure", async () => {
      clientHttp.get = async <T>() => ({
        data: {
          email: 'user@yopmail.com',
          attributes: {},
        } as unknown as T,
      });
      await brevo.metsÀJourMesurePriseEnCompte(
        new MesurePriseEnCompte('mesure.prise.en.compte@mail.com', 'AUTH.5', 12, 6, 'allégé')
      );

      assert.equal(urlPutAppelée, 'FAUSSE_URL_BREVO/contacts/mesure.prise.en.compte@mail.com');
      assert.deepEqual(donnéesPutAppelées.attributes.DATE_DERNIERE_PRISE_EN_COMPTE_MESURE, new Date('2025-03-10'));
    });

    it('mets à jour le nombre de mesure prise en compte', async () => {
      clientHttp.get = async <T>() => ({
        data: {
          email: 'user@yopmail.com',
          attributes: {
            NOMBRE_MESURES_PRISES_EN_COMPTE: 2,
          },
        } as unknown as T,
      });
      await brevo.metsÀJourMesurePriseEnCompte(
        new MesurePriseEnCompte('mesure.prise.en.compte@mail.com', 'AUTH.5', 12, 6, 'allégé')
      );

      assert.equal(urlPutAppelée, 'FAUSSE_URL_BREVO/contacts/mesure.prise.en.compte@mail.com');
      assert.equal(donnéesPutAppelées.attributes.NOMBRE_MESURES_PRISES_EN_COMPTE, 3);
    });

    it('mets à jour la date de dernière complétion de module', async () => {
      clientHttp.get = async <T>() => ({
        data: {
          email: 'user@yopmail.com',
          attributes: {
            NOMBRE_MODULES_TERMINES: 2,
          },
        } as unknown as T,
      });

      await brevo.metsÀJourModuleTerminé(new ModuleTermine('module.termine@mail.com', 1, 'CyberDépart', 'allégé'));

      assert.equal(urlPutAppelée, 'FAUSSE_URL_BREVO/contacts/module.termine@mail.com');
      assert.deepEqual(donnéesPutAppelées, {
        attributes: {
          DATE_DERNIERE_COMPLETION_MODULE: new Date('2025-03-10'),
          NOMBRE_MODULES_TERMINES: 3,
        },
      });
    });

    it('mets à jour la date de déblocage du badge CyberDépart', async () => {
      await brevo.metsÀJourBadgeCyberdépartDébloqué(new BadgeCyberdépartDébloqué('badge.debolque@mail.com', 10, 12));

      assert.equal(urlPutAppelée, 'FAUSSE_URL_BREVO/contacts/badge.debolque@mail.com');
      assert.deepEqual(donnéesPutAppelées, {
        attributes: {
          DATE_DEBLOCAGE_BADGE_CYBERDEPART: new Date('2025-03-10'),
        },
      });
    });

    it('mets à jour le parcours', async () => {
      await brevo.metsÀJourParcours(
        new ParcoursRejoint('parcours.rejoint@mail.com', 'allégé', 'visite-page-module', { campagne: 'campagne' })
      );

      assert.equal(urlPutAppelée, 'FAUSSE_URL_BREVO/contacts/parcours.rejoint@mail.com');
      assert.deepEqual(donnéesPutAppelées, {
        attributes: {
          PARCOURS: 'allégé',
        },
      });
    });
  });
});
