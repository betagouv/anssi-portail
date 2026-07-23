import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { detruisSession } from './session.js';
import { corpsVide, valideCorpsRequete } from './zod.js';
import { filetRouteAsynchrone } from './middleware.js';
import { estUrlRedirectionApresConnexionAutorisee } from './routesPagesConnectees.js';

const ressourcePageConnexion = ({ fournisseurChemin }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const urlRedirection = requete.query.urlRedirection;
      if (
        urlRedirection !== undefined &&
        (typeof urlRedirection !== 'string' || !estUrlRedirectionApresConnexionAutorisee(urlRedirection))
      ) {
        reponse.redirect('/connexion');
        return;
      }

      detruisSession(requete, reponse);
      await reponse
        .contentType('text/html')
        .status(200)
        .envoieFichierEnrichi(fournisseurChemin.cheminPageJekyll('connexion'));
    })
  );

  return routeur;
};
export { ressourcePageConnexion };
