import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AxiosError } from '@anssi-portail/axios';

import { AdaptateurEmail } from '@metier/adaptateurEmail.js';
import { BadgeCyberdépartDébloqué } from '@bus/evenements/badgeCyberdepartDebloque.js';
import { MesureConsultee } from '@bus/evenements/mesureConsultee.js';
import { MesurePriseEnCompte } from '@bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '@bus/evenements/moduleTermine.js';
import { ParcoursAllégéTerminé } from '@bus/evenements/parcoursAllegeTermine.js';
import { ParcoursChangé } from '@bus/evenements/parcoursChange.js';
import { ParcoursCompletTerminé } from '@bus/evenements/parcoursCompletTermine.js';
import { ParcoursRejoint } from '@bus/evenements/parcoursRejoint.js';
import { adaptateurEmailBrevo } from '@infra/adaptateurEmailBrevo.js';
import { ClientHttp } from '@infra/clientHttp.js';

import { fauxAdaptateurEnvironnement, fauxRapporteur } from '../api/fauxObjets.js';
import { fabriqueAdaptateurHorloge } from './adaptateurHorlogePourLesTests.js';
import { fabriqueClientPost, fabriqueFauxClientHttp } from './fournisseurClientHttp.js';

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

  const adaptateurHorloge = fabriqueAdaptateurHorloge('2025-03-10T00:00:00Z');

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
      rapporteur: fauxRapporteur,
      clientHttp,
      adaptateurEnvironnement: fauxAdaptateurEnvironnement,
      adaptateurHorloge,
    });
  });

  describe('pour la création de contact', () => {
    it('poste un message à axios', async () => {
      await brevo.creeContactBrevo(fauxContact());

      expect(postAxiosAppele).toBe(true);
    });
  });

  describe('pour l’inscription à l’infolettre', () => {
    it('poste un message à axios', async () => {
      await brevo.inscrisAInfolettre('email');

      expect(postAxiosAppele).toBe(true);
    });
  });

  describe('lorsqu’une erreur se produit', () => {
    it.each(['contact', 'infolettre'])('signale et propage la même erreur (%s)', async (opération) => {
      const erreur = new AxiosError('Une erreur s’est produite');
      const rapporteur = { erreur: vi.fn() };
      const clientHttp = {
        ...fabriqueFauxClientHttp(),
        post: fabriqueClientPost(async () => {
          throw erreur;
        }),
      };
      const brevo = adaptateurEmailBrevo({
        clientHttp,
        adaptateurEnvironnement: fauxAdaptateurEnvironnement,
        adaptateurHorloge,
        rapporteur,
      });

      await expect(
        opération === 'contact' ? brevo.creeContactBrevo(fauxContact()) : brevo.inscrisAInfolettre('email')
      ).rejects.toBe(erreur);
      expect(rapporteur.erreur).toHaveBeenCalledExactlyOnceWith(erreur, 'Erreur API Brevo');
    });
  });

  describe('lors de la mise à jour des informations liées au parcours de sécurisation', () => {
    it("mets à jour la date de dernière consultation d'une mesure", async () => {
      await brevo.metsÀJourMesureConsultée(new MesureConsultee('mesure.consultee@mail.com', 'AUTH.5'));

      expect(urlPostAppelée).toBe('FAUSSE_URL_BREVO/events');
      expect(donnéesPostAppelées).toEqual({
        event_name: 'mesure_consultee',
        identifiers: { email_id: 'mesure.consultee@mail.com' },
        contact_properties: {
          DATE_DERNIERE_CONSULTATION_MESURE: '2025-03-10T00:00:00.000Z',
        },
      });
    });

    it("mets à jour le parcours en plus de la date de dernière consultation d'une mesure", async () => {
      await brevo.metsÀJourMesureConsultée(new MesureConsultee('mesure.consultee@mail.com', 'AUTH.5', 'allégé'));

      expect(urlPostAppelée).toBe('FAUSSE_URL_BREVO/events');
      expect(donnéesPostAppelées).toEqual({
        event_name: 'mesure_consultee',
        identifiers: { email_id: 'mesure.consultee@mail.com' },
        contact_properties: {
          DATE_DERNIERE_CONSULTATION_MESURE: '2025-03-10T00:00:00.000Z',
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

      expect(urlPostAppelée).toBe('FAUSSE_URL_BREVO/events');
      expect(donnéesPostAppelées).toEqual({
        event_name: 'mesure_prise_en_compte',
        identifiers: { email_id: 'mesure.prise.en.compte@mail.com' },
        contact_properties: {
          DATE_DERNIERE_PRISE_EN_COMPTE_MESURE: '2025-03-10T00:00:00.000Z',
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

      expect(urlPostAppelée).toBe('FAUSSE_URL_BREVO/events');
      expect(donnéesPostAppelées).toEqual({
        event_name: 'module_termine',
        identifiers: { email_id: 'module.termine@mail.com' },
        contact_properties: {
          DATE_DERNIERE_COMPLETION_MODULE: '2025-03-10T00:00:00.000Z',
          NOMBRE_MODULES_TERMINES: 3,
        },
      });
    });

    it('émets un événement de déblocage de badge CyberDépart', async () => {
      await brevo.metsÀJourBadgeCyberdépartDébloqué(new BadgeCyberdépartDébloqué('badge.debloque@mail.com', 10, 12));

      expect(urlPostAppelée).toBe('FAUSSE_URL_BREVO/events');
      expect(donnéesPostAppelées).toEqual({
        event_name: 'badge_cyberdepart_debloque',
        identifiers: { email_id: 'badge.debloque@mail.com' },
        contact_properties: {
          DATE_DEBLOCAGE_BADGE_CYBERDEPART: '2025-03-10T00:00:00.000Z',
        },
      });
    });

    it('émets un événement de rattachement de parcours', async () => {
      await brevo.metsÀJourParcoursRejoint(
        new ParcoursRejoint('parcours.rejoint@mail.com', 'allégé', 'visite-page-module', { campagne: 'campagne' })
      );

      expect(urlPostAppelée).toBe('FAUSSE_URL_BREVO/events');
      expect(donnéesPostAppelées).toEqual({
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

      expect(urlPostAppelée).toBe('FAUSSE_URL_BREVO/events');
      expect(donnéesPostAppelées).toEqual({
        event_name: 'parcours_change',
        identifiers: { email_id: 'parcours.changé@mail.com' },
        contact_properties: {
          PARCOURS: 'complet',
        },
      });
    });

    it('émets un événement de complétion du parcours allégé', async () => {
      await brevo.metsÀJourParcoursAllégéTerminé(new ParcoursAllégéTerminé('parcours.allege.termine@mail.com'));

      expect(urlPostAppelée).toBe('FAUSSE_URL_BREVO/events');
      expect(donnéesPostAppelées).toEqual({
        event_name: 'parcours_allege_termine',
        identifiers: { email_id: 'parcours.allege.termine@mail.com' },
      });
    });

    it('émets un événement de complétion du parcours complet', async () => {
      await brevo.metsÀJourParcoursCompletTerminé(new ParcoursCompletTerminé('parcours.complet.termine@mail.com'));

      expect(urlPostAppelée).toBe('FAUSSE_URL_BREVO/events');
      expect(donnéesPostAppelées).toEqual({
        event_name: 'parcours_complet_termine',
        identifiers: { email_id: 'parcours.complet.termine@mail.com' },
      });
    });
  });
});
