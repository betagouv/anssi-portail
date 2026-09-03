import { AxiosError } from '@anssi-portail/axios';
import assert from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { BadgeCyberdépartDébloqué } from '../../src/bus/evenements/badgeCyberdepartDebloque.js';
import { MesureConsultee } from '../../src/bus/evenements/mesureConsultee.js';
import { MesurePriseEnCompte } from '../../src/bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '../../src/bus/evenements/moduleTermine.js';
import { ParcoursAllégéTerminé } from '../../src/bus/evenements/parcoursAllegeTermine.js';
import { ParcoursCompletTerminé } from '../../src/bus/evenements/parcoursCompletTermine.js';
import { ParcoursRejoint } from '../../src/bus/evenements/parcoursRejoint.js';
import { adaptateurEmailBrevo } from '../../src/infra/adaptateurEmailBrevo.js';
import { AdaptateurHorloge } from '../../src/infra/adaptateurHorloge.js';
import { ClientHttp } from '../../src/infra/clientHttp.js';
import { AdaptateurEmail } from '../../src/metier/adaptateurEmail.js';
import { fauxAdaptateurEnvironnement } from '../api/fauxObjets.js';
import { fabriqueClientPost, fabriqueFauxClientHttp } from './fournisseurClientHttp.js';
import { ParcoursChangé } from '../../src/bus/evenements/parcoursChange.js';

describe('L’adaptateur email Brevo', () => {
  let clientHttp: ClientHttp;
  let brevo: AdaptateurEmail;
  let postAxiosAppele: boolean = false;
  let donnéesPostAppelées: unknown;
  let urlPostAppelée: unknown;

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

    urlPostAppelée = '';

    clientHttp = {
      ...fabriqueFauxClientHttp(),
      post: fabriqueClientPost(async (url: string, données: unknown) => {
        postAxiosAppele = true;
        urlPostAppelée = url;
        donnéesPostAppelées = données;
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

      assert.equal(postAxiosAppele, true);
    });
  });

  describe('pour l’inscription à l’infolettre', () => {
    it('poste un message à axios', async () => {
      await brevo.inscrisAInfolettre('email');

      assert.equal(postAxiosAppele, true);
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
          assert.equal(messageLog, 'Une erreur s’est produite');
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
          assert.equal(messageLog, 'Une erreur s’est produite');
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

      assert.equal(urlPostAppelée, 'FAUSSE_URL_BREVO/events');
      assert.deepEqual(donnéesPostAppelées, {
        event_name: 'mesure_consultee',
        identifiers: { email_id: 'mesure.consultee@mail.com' },
        contact_properties: {
          DATE_DERNIERE_CONSULTATION_MESURE: new Date('2025-03-10'),
        },
      });
    });

    it("mets à jour le parcours en plus de la date de dernière consultation d'une mesure", async () => {
      await brevo.metsÀJourMesureConsultée(new MesureConsultee('mesure.consultee@mail.com', 'AUTH.5', 'allégé'));

      assert.equal(urlPostAppelée, 'FAUSSE_URL_BREVO/events');
      assert.deepEqual(donnéesPostAppelées, {
        event_name: 'mesure_consultee',
        identifiers: { email_id: 'mesure.consultee@mail.com' },
        contact_properties: {
          DATE_DERNIERE_CONSULTATION_MESURE: new Date('2025-03-10'),
          PARCOURS: 'allégé',
        },
      });
    });

    it('mets à jour le nombre de mesure prise en compte ainsi que la date', async () => {
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

      assert.equal(urlPostAppelée, 'FAUSSE_URL_BREVO/events');
      assert.deepEqual(donnéesPostAppelées, {
        event_name: 'mesure_prise_en_compte',
        identifiers: { email_id: 'mesure.prise.en.compte@mail.com' },
        contact_properties: {
          DATE_DERNIERE_PRISE_EN_COMPTE_MESURE: new Date('2025-03-10'),
          NOMBRE_MESURES_PRISES_EN_COMPTE: 3,
        },
      });
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

      assert.equal(urlPostAppelée, 'FAUSSE_URL_BREVO/events');
      assert.deepEqual(donnéesPostAppelées, {
        event_name: 'module_termine',
        identifiers: { email_id: 'module.termine@mail.com' },
        contact_properties: {
          DATE_DERNIERE_COMPLETION_MODULE: new Date('2025-03-10'),
          NOMBRE_MODULES_TERMINES: 3,
        },
      });
    });

    it('émets un événement de déblocage de badge CyberDépart', async () => {
      await brevo.metsÀJourBadgeCyberdépartDébloqué(new BadgeCyberdépartDébloqué('badge.debloque@mail.com', 10, 12));

      assert.equal(urlPostAppelée, 'FAUSSE_URL_BREVO/events');
      assert.deepEqual(donnéesPostAppelées, {
        event_name: 'badge_cyberdepart_debloque',
        identifiers: { email_id: 'badge.debloque@mail.com' },
        contact_properties: {
          DATE_DEBLOCAGE_BADGE_CYBERDEPART: new Date('2025-03-10'),
        },
      });
    });

    it('émets un événement de rattachement de parcours', async () => {
      await brevo.metsÀJourParcoursRejoint(
        new ParcoursRejoint('parcours.rejoint@mail.com', 'allégé', 'visite-page-module', { campagne: 'campagne' })
      );

      assert.equal(urlPostAppelée, 'FAUSSE_URL_BREVO/events');
      assert.deepEqual(donnéesPostAppelées, {
        event_name: 'parcours_rejoint',
        identifiers: { email_id: 'parcours.rejoint@mail.com' },
        contact_properties: {
          PARCOURS: 'allégé',
        },
      });
    });

    it('émets un événement de changement de parcours', async () => {
      await brevo.metsÀJourParcoursChangé(
        new ParcoursChangé('parcours.changé@mail.com', 'allégé', 'complet', 'visite-page-module')
      );

      assert.equal(urlPostAppelée, 'FAUSSE_URL_BREVO/events');
      assert.deepEqual(donnéesPostAppelées, {
        event_name: 'parcours_change',
        identifiers: { email_id: 'parcours.changé@mail.com' },
        contact_properties: {
          PARCOURS: 'complet',
        },
      });
    });

    it('émets un événement de complétion du parcours allégé', async () => {
      await brevo.metsÀJourParcoursAllégéTerminé(new ParcoursAllégéTerminé('parcours.allege.termine@mail.com'));

      assert.equal(urlPostAppelée, 'FAUSSE_URL_BREVO/events');
      assert.deepEqual(donnéesPostAppelées, {
        event_name: 'parcours_allege_termine',
        identifiers: { email_id: 'parcours.allege.termine@mail.com' },
      });
    });

    it('émets un événement de complétion du parcours complet', async () => {
      await brevo.metsÀJourParcoursCompletTerminé(new ParcoursCompletTerminé('parcours.complet.termine@mail.com'));

      assert.equal(urlPostAppelée, 'FAUSSE_URL_BREVO/events');
      assert.deepEqual(donnéesPostAppelées, {
        event_name: 'parcours_complet_termine',
        identifiers: { email_id: 'parcours.complet.termine@mail.com' },
      });
    });
  });
});
