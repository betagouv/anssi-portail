import axiosSécurisé, { isAxiosError } from '@anssi-portail/axios';
import { decode } from 'html-entities';
import { BadgeCyberdépartDébloqué } from '../bus/evenements/badgeCyberdepartDebloque.js';
import { MesureConsultee } from '../bus/evenements/mesureConsultee.js';
import { MesurePriseEnCompte } from '../bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '../bus/evenements/moduleTermine.js';
import { ParcoursChangé } from '../bus/evenements/parcoursChange.js';
import { ParcoursRejoint } from '../bus/evenements/parcoursRejoint.js';
import { AdaptateurEmail } from '../metier/adaptateurEmail.js';
import { Telephone } from '../metier/telephone.js';
import { adaptateurEmailConsole } from './adaptateurEmailConsole.js';
import { ClientHttp } from './clientHttp.js';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';
import { AdaptateurHorloge } from './adaptateurHorloge.js';

const enteteJSON = (adaptateurEnvironnement: AdaptateurEnvironnement) => ({
  headers: {
    'api-key': adaptateurEnvironnement.brevo().cléAPI(),
    accept: 'application/json',
    'content-type': 'application/json',
  },
});

const metsÀJourContact = async ({
  clientHttp,
  adaptateurEnvironnement,
  email,
  attributes,
  messageErreur,
}: {
  clientHttp: ClientHttp;
  adaptateurEnvironnement: AdaptateurEnvironnement;
  email: string;
  attributes: Record<string, unknown>;
  messageErreur: string;
}) => {
  try {
    await clientHttp.put(`${adaptateurEnvironnement.brevo().url()}/contacts/${email}`, { attributes });
  } catch (erreur: unknown) {
    if (isAxiosError(erreur)) {
      throw new Error(messageErreur, erreur.response?.data.message);
    }
    throw erreur;
  }
};

export const adaptateurEmailBrevo = ({
  clientHttp,
  adaptateurEnvironnement,
  adaptateurHorloge,
}: {
  clientHttp: ClientHttp;
  adaptateurEnvironnement: AdaptateurEnvironnement;
  adaptateurHorloge: AdaptateurHorloge;
}): AdaptateurEmail => ({
  envoieEmailBienvenue: async ({ email, prenom }: { email: string; prenom: string }) => {
    await clientHttp.post(
      `${adaptateurEnvironnement.brevo().url()}/smtp/email`,
      {
        to: [{ email }],
        templateId: parseInt(process.env.BREVO_ID_TEMPLATE_BIENVENUE || '0'),
        PRENOM: decode(prenom),
      },
      enteteJSON(adaptateurEnvironnement)
    );
  },
  creeContactBrevo: async ({
    email,
    prenom,
    nom,
    infoLettre,
    pixelDeSuiviAccepté,
    telephone,
  }: {
    email: string;
    prenom: string;
    nom: string;
    infoLettre: boolean;
    pixelDeSuiviAccepté: boolean;
    telephone?: string;
  }) => {
    try {
      await clientHttp.post(
        `${adaptateurEnvironnement.brevo().url()}/contacts`,
        {
          updateEnabled: true,
          email,
          emailBlacklisted: !infoLettre,
          attributes: {
            PRENOM: decode(prenom),
            NOM: decode(nom),
            SMS: new Telephone(telephone).auFormatInternational(),
            _PIXEL_TRACKING_CONSENT: pixelDeSuiviAccepté,
          },
        },
        enteteJSON(adaptateurEnvironnement)
      );
    } catch (erreur: Error | unknown) {
      if (isAxiosError(erreur)) {
        if (erreur.response?.data.message === 'Contact already exist') return Promise.resolve();

        console.error(erreur.message, {
          'Erreur renvoyée par API Brevo': erreur.response?.data,
        });
        return Promise.reject(erreur);
      }
    }
  },
  inscrisAInfolettre: async (email: string) => {
    try {
      await clientHttp.post(
        `${adaptateurEnvironnement.brevo().url()}/contacts`,
        {
          updateEnabled: true,
          email,
          emailBlacklisted: false,
          listIds: [Number(process.env.BREVO_ID_LISTE_ATTENTE_INFOLETTRE || '-1')].filter((i) => i != -1),
        },
        enteteJSON(adaptateurEnvironnement)
      );
    } catch (erreur: Error | unknown) {
      if (isAxiosError(erreur)) {
        if (erreur.response?.data.message === 'Contact already exist') {
          return undefined;
        }
        console.error(erreur.message, { 'Erreur renvoyée par API Brevo': erreur.response?.data });
        throw erreur;
      }
    }
  },
  metsÀJourMesureConsultée: async (événement: MesureConsultee) =>
    metsÀJourContact({
      clientHttp,
      adaptateurEnvironnement,
      email: événement.email,
      attributes: { DATE_DERNIERE_CONSULTATION_MESURE: adaptateurHorloge.maintenant() },
      messageErreur: "Erreur lors de la mise à jour d'une mesure consultée sur Brévo : ",
    }),
  metsÀJourMesurePriseEnCompte: async (événement: MesurePriseEnCompte) =>
    metsÀJourContact({
      clientHttp,
      adaptateurEnvironnement,
      email: événement.email,
      attributes: { DATE_DERNIERE_PRISE_EN_COMPTE_MESURE: adaptateurHorloge.maintenant() },
      messageErreur: "Erreur lors de la mise à jour d'une mesure prise en compte sur Brévo : ",
    }),
  metsÀJourModuleTerminé: async (événement: ModuleTermine) =>
    metsÀJourContact({
      clientHttp,
      adaptateurEnvironnement,
      email: événement.email,
      attributes: { DATE_DERNIERE_COMPLETION_MODULE: adaptateurHorloge.maintenant() },
      messageErreur: "Erreur lors de la mise à jour d'une complétion de module sur Brévo : ",
    }),
  metsÀJourBadgeCyberdépartDébloqué: async (événement: BadgeCyberdépartDébloqué) =>
    metsÀJourContact({
      clientHttp,
      adaptateurEnvironnement,
      email: événement.email,
      attributes: { DATE_DEBLOCAGE_BADGE_CYBERDEPART: adaptateurHorloge.maintenant() },
      messageErreur: 'Erreur lors de la mise à jour du déblocage du badge CyberDépart sur Brévo : ',
    }),
  metsÀJourParcours: async (événement: ParcoursChangé | ParcoursRejoint) =>
    metsÀJourContact({
      clientHttp,
      adaptateurEnvironnement,
      email: événement.email,
      attributes: { PARCOURS: événement.parcours },
      messageErreur: 'Erreur lors de la mise à jour du parcours sur Brévo : ',
    }),
});

export const fabriqueAdaptateurEmail = (
  adaptateurEnvironnement: AdaptateurEnvironnement,
  adaptateurHorloge: AdaptateurHorloge
) =>
  adaptateurEnvironnement.brevo().url() && adaptateurEnvironnement.brevo().cléAPI()
    ? adaptateurEmailBrevo({ clientHttp: axiosSécurisé, adaptateurEnvironnement, adaptateurHorloge })
    : adaptateurEmailConsole();
