import { CompteCree } from './evenements/compteCree.js';
import { AdaptateurEmail } from '../metier/adaptateurEmail.js';

export const envoieEmailCreationCompte = ({ adaptateurEmail }: { adaptateurEmail: AdaptateurEmail }) => {
  return async function ({ email, prenom }: CompteCree) {
    await adaptateurEmail.envoieEmailBienvenue({ email, prenom });
  };
};
