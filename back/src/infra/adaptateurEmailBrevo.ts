import { adaptateurEmailConsole } from './adaptateurEmailConsole';
import { AdaptateurEmail } from '../metier/adaptateurEmail';
import axios from 'axios';
import { decode } from 'html-entities';

const enteteJSON = {
  headers: {
    'api-key': process.env.BREVO_CLE_API,
    accept: 'application/json',
    'content-type': 'application/json',
  },
};
const urlBase = process.env.BREVO_API_URL_BASE;

export const adaptateurEmailBrevo = (): AdaptateurEmail => ({
  envoieEmailBienvenue: async ({
    email,
    prenom,
  }: {
    email: string;
    prenom: string;
  }) => {
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
  }: {
    email: string;
    prenom: string;
    nom: string;
    infoLettre: boolean;
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
          },
        },
        enteteJSON
      )
      .catch((e) => {
        if (e.response.data.message === 'Contact already exist')
          return Promise.resolve();

        console.error(e, {
          'Erreur renvoyée par API Brevo': e.response.data,
        });
        return Promise.reject(e);
      });
  },
});

export const fabriqueAdaptateurEmail = () =>
  process.env.BREVO_CLE_API ? adaptateurEmailBrevo() : adaptateurEmailConsole();
