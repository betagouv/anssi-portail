import { Request, RequestHandler, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourcePagesJekyllConnectees = (
  { fournisseurChemin, middleware, entrepotUtilisateur, adaptateurHachage }: ConfigurationServeur,
  nomPage: string,
  gestionnairesRequêtesComplémentaires: RequestHandler[] = []
): Router => {
  const routeur = Router({ mergeParams: true });

  routeur.get(
    '/',
    middleware.verifieJWTNavigation,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    ...gestionnairesRequêtesComplémentaires,
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      reponse.contentType('text/html').status(200).envoieFichierEnrichi(fournisseurChemin.jekyll.page(nomPage));
    })
  );

  return routeur;
};
export { ressourcePagesJekyllConnectees };
