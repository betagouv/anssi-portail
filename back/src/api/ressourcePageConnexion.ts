import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';

const ressourcePageConnexion = (
  { fournisseurChemin }: ConfigurationServeur,
): Router => {
  const routeur = Router();

  routeur.get(
    '/',
    (_requete: Request, reponse: Response) => {
      reponse.clearCookie('session');
      reponse
        .contentType('text/html')
        .status(200)
        .sendFile(fournisseurChemin.cheminPageJekyll("connexion"));
    }
  );

  return routeur;
};
export { ressourcePageConnexion };
