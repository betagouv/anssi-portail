import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourcePagesJekyllModule1 = ({
  fournisseurChemin,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  gestionnairesRequêtesComplémentaires,
}: ConfigurationServeur): Router => {
  const routeur = Router({ mergeParams: true });

  routeur.get(
    '/',
    middleware.verifieJWTNavigation,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    gestionnairesRequêtesComplémentaires.attributionParcours('allégé'),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      reponse
        .contentType('text/html')
        .status(HttpStatusCode.Ok)
        .envoieFichierEnrichi(
          fournisseurChemin.jekyll.page(
            requete.utilisateur?.parcoursActuel() === 'allégé' ? 'module-cyberdepart' : 'modules'
          )
        );
    })
  );

  return routeur;
};
export { ressourcePagesJekyllModule1 };
