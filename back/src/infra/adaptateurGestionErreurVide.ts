import { AdaptateurGestionErreur } from './adaptateurGestionErreurSentry';

export const adaptateurGestionVide: AdaptateurGestionErreur = {
  initialise: () => {},
  controleurErreurs: (erreur, requete, reponse, suite) => suite(erreur)
}
