import { AdaptateurGestionErreur } from './adaptateurGestionErreurSentry';

export const adaptateurGestionVide: AdaptateurGestionErreur = {
  initialise: () => {},
  controleurErreurs: (erreur, _requete, _reponse, suite) => suite(erreur)
}
