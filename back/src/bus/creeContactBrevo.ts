import { AdaptateurEmail } from '../metier/adaptateurEmail.js';
import { CompteCree } from './evenements/compteCree.js';

export const creeContactBrevo = ({ adaptateurEmail }: { adaptateurEmail: AdaptateurEmail }) => {
  return async function ({ email, nom, prenom, infoLettre, pixelDeSuiviAccepté, telephone }: CompteCree) {
    await adaptateurEmail.creeContactBrevo({ email, nom, prenom, infoLettre, pixelDeSuiviAccepté, telephone });
  };
};
