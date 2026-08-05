import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';
import { CodeRegion } from '../metier/referentielRegions.js';

const ressourcePageContact = ({ fournisseurChemin }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get(
    '/:id',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      await reponse
        .contentType('text/html')
        .status(HttpStatusCode.Ok)
        .envoieFichierEnrichi(fournisseurChemin.jekyll.contact(requete.params.id as CodeRegion));
    })
  );

  return routeur;
};
export { ressourcePageContact };
