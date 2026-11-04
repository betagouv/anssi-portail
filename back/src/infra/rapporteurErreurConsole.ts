/* eslint-disable no-console */
import { RapporteurErreur } from '../metier/rapporteurErreur.js';

export const rapporteurErreurConsole: RapporteurErreur = {
  erreur: (erreur, message) => {
    console.error(...(message === undefined ? [erreur] : [message, erreur]));
  },
};
