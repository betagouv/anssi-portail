import { HttpStatusCode } from 'axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourcePageProduit = ({ fournisseurChemin }: ConfigurationServeur, repertoireProduits: string): Router => {
  const routeur = Router();

  routeur.get(
    '/:id',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      await reponse
        .contentType('text/html')
        .status(HttpStatusCode.Ok)
        .envoieFichierEnrichi(fournisseurChemin.versRessourceJekyll(repertoireProduits, requete.params.id as string));
    })
  );

  return routeur;
};
export { ressourcePageProduit };
