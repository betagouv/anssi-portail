/* eslint-disable no-console */
import { Rapporteur } from '../metier/rapporteur.js';

export const rapporteurConsole: Rapporteur = {
  erreur: (erreur, message) => {
    console.error(...(message === undefined ? [erreur] : [message, erreur]));
  },
};
