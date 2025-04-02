import { adaptateurEmailConsole } from './adaptateurEmailConsole';
import { AdaptateurEmail } from '../metier/adaptateurEmail';
import axios from 'axios';

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
        PRENOM: prenom,
      },
      enteteJSON
    );
  },
});

export const fabriqueAdaptateurEmail = () =>
  process.env.BREVO_CLE_API ? adaptateurEmailBrevo() : adaptateurEmailConsole();
