import { CompteCree } from './evenements/compteCree';
import { AdaptateurEmail } from '../metier/adaptateurEmail';

export const envoieEmailCreationCompte = ({
  adaptateurEmail,
}: {
  adaptateurEmail: AdaptateurEmail;
}) => {
  return async function ({ email, prenom }: CompteCree) {
    await adaptateurEmail.envoieEmailBienvenue({ email, prenom });
  };
};
