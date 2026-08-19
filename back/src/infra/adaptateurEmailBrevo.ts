import axiosSécurisé, { isAxiosError } from '@anssi-portail/axios';
import { decode } from 'html-entities';
import { AdaptateurEmail } from '../metier/adaptateurEmail.js';
import { Telephone } from '../metier/telephone.js';
import { adaptateurEmailConsole } from './adaptateurEmailConsole.js';
import { ClientHttp } from './clientHttp.js';
import { AdaptateurEnvironnement } from './adaptateurEnvironnement.js';

const enteteJSON = (adaptateurEnvironnement: AdaptateurEnvironnement) => ({
  headers: {
    'api-key': adaptateurEnvironnement.brevo().cléAPI(),
    accept: 'application/json',
    'content-type': 'application/json',
  },
});

export const adaptateurEmailBrevo = ({
  clientHttp,
  adaptateurEnvironnement,
}: {
  clientHttp: ClientHttp;
  adaptateurEnvironnement: AdaptateurEnvironnement;
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
});

export const fabriqueAdaptateurEmail = (adaptateurEnvironnement: AdaptateurEnvironnement) =>
  adaptateurEnvironnement.brevo().url() && adaptateurEnvironnement.brevo().cléAPI()
    ? adaptateurEmailBrevo({ clientHttp: axiosSécurisé, adaptateurEnvironnement })
    : adaptateurEmailConsole();
