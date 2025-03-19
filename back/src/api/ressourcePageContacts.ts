import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';

const ressourcePageContacts = (
  { fournisseurChemin, middleware }: ConfigurationServeur,
): Router => {
  const routeur = Router();

  routeur.get(
    '/',
    middleware.verifieJWTNavigation,
    async (_requete: Request, reponse: Response) => {
      reponse
        .contentType('text/html')
        .status(200)
        .sendFile(fournisseurChemin.cheminPageJekyll('contacts'));
    }
  );

  return routeur;
};
export { ressourcePageContacts };
