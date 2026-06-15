import axios, { AxiosRequestConfig } from 'axios';
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

type FonctionPostAxios = (url: string, data: unknown, config: AxiosRequestConfig<unknown> | undefined) => Promise<void>;

const posteSurBrevo = async (url: string, data: unknown, config: AxiosRequestConfig<unknown> | undefined) => {
  await axios.post(url, data, config);
};

export const adaptateurEmailBrevo = (fnAppelleAxios: FonctionPostAxios): AdaptateurEmail => ({
  envoieEmailBienvenue: async ({ email, prenom }: { email: string; prenom: string }) => {
    await fnAppelleAxios(
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
    try {
      await fnAppelleAxios(
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
      );
    } catch (erreur: Error | unknown) {
      if (axios.isAxiosError(erreur)) {
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
      await fnAppelleAxios(
        `${urlBase}/contacts`,
        {
          updateEnabled: true,
          email,
          emailBlacklisted: false,
          listIds: [Number(process.env.BREVO_ID_LISTE_ATTENTE_INFOLETTRE || '-1')].filter((i) => i != -1),
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
  process.env.BREVO_CLE_API ? adaptateurEmailBrevo(posteSurBrevo) : adaptateurEmailConsole();
