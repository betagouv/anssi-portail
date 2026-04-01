import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import { filetRouteAsynchrone } from './middleware';

const ressourcePagesJekyllConnectees = (
  { fournisseurChemin, middleware }: ConfigurationServeur,
  nomPage: string
): Router => {
  const routeur = Router();

  routeur.get(
    '/',
    middleware.verifieJWTNavigation,
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      reponse.contentType('text/html').status(200).sendFileAvecNonce(fournisseurChemin.cheminPageJekyll(nomPage));
    })
  );

  return routeur;
};
export { ressourcePagesJekyllConnectees };
