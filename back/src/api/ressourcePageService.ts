import { HttpStatusCode } from 'axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourcePageService = ({ fournisseurChemin }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get(
    '/:id',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      await reponse
        .contentType('text/html')
        .status(HttpStatusCode.Ok)
        .envoieFichierEnrichi(fournisseurChemin.jekyll.service(requete.params.id as string));
    })
  );

  return routeur;
};
export { ressourcePageService };
