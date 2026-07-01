import { AdaptateurGestionErreur } from './adaptateurGestionErreurSentry.js';

export const adaptateurGestionVide: AdaptateurGestionErreur = {
  initialise: () => {},
  controleurErreurs: (erreur, _requete, _reponse, suite) => suite(erreur),
};
