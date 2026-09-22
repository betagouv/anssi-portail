import { AdaptateurEmail } from '../metier/adaptateurEmail.js';
import { CompteCree } from './evenements/compteCree.js';

export const envoieEmailCreationCompte = ({ adaptateurEmail }: { adaptateurEmail: AdaptateurEmail }) => {
  return async function ({ email, prenom }: CompteCree) {
    await adaptateurEmail.envoieEmailBienvenue({ email, prenom });
  };
};
