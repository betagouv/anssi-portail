import axios from 'axios';
import { decode } from 'html-entities';
import { AdaptateurEmail } from '../metier/adaptateurEmail';
import { Telephone } from '../metier/telephone';
import { adaptateurEmailConsole } from './adaptateurEmailConsole';

const enteteJSON = {
  headers: {
    'api-key': process.env.BREVO_CLE_API,
    accept: 'application/json',
    'content-type': 'application/json',
  },
};
const urlBase = process.env.BREVO_API_URL_BASE;

export const adaptateurEmailBrevo = (): AdaptateurEmail => ({
  envoieEmailBienvenue: async ({ email, prenom }: { email: string; prenom: string }) => {
    await axios.post(
      `${urlBase}/smtp/email`,
      {
        to: [{ email }],
        templateId: parseInt(process.env.BREVO_ID_TEMPLATE_BIENVENUE || '0'),
        PRENOM: decode(prenom),
      },
      enteteJSON
    );
  },
  creeContactBrevo: async ({
    email,
    prenom,
    nom,
    infoLettre,
    telephone,
  }: {
    email: string;
    prenom: string;
    nom: string;
    infoLettre: boolean;
    telephone?: string;
  }) => {
    axios
      .post(
        `${urlBase}/contacts`,
        {
          updateEnabled: true,
          email,
          emailBlacklisted: !infoLettre,
          attributes: {
            PRENOM: decode(prenom),
            NOM: decode(nom),
            SMS: new Telephone(telephone).auFormatInternational(),
          },
        },
        enteteJSON
      )
      .catch((e) => {
        if (e.response.data.message === 'Contact already exist') return Promise.resolve();

        console.error(e, {
          'Erreur renvoyée par API Brevo': e.response.data,
        });
        return Promise.reject(e);
      });
  },
  inscrisAInfolettre: async (email: string) => {
    try {
      await axios.post(
        `${urlBase}/contacts`,
        {
          updateEnabled: true,
          email,
          emailBlacklisted: false,
        },
        enteteJSON
      );
    } catch (erreur: Error | unknown) {
      if (axios.isAxiosError(erreur)) {
        if (erreur.response?.data.message === 'Contact already exist') {
          return undefined;
        }
        console.error(erreur, { 'Erreur renvoyée par API Brevo': erreur.response?.data });
        throw erreur;
      }
    }
  },
});

export const fabriqueAdaptateurEmail = () =>
  process.env.BREVO_CLE_API ? adaptateurEmailBrevo() : adaptateurEmailConsole();
