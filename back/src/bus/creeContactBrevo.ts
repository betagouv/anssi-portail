import { AdaptateurEmail } from '../metier/adaptateurEmail';
import { CompteCree } from './evenements/compteCree';

export const creeContactBrevo = ({
  adaptateurEmail,
}: {
  adaptateurEmail: AdaptateurEmail;
}) => {
  return async function ({ email, nom, prenom, infoLettre }: CompteCree) {
    await adaptateurEmail.creeContactBrevo({ email, nom, prenom, infoLettre });
  };
};
