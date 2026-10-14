import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { estCodeRegion } from '../metier/referentielRegions.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { FichierInconnu } from './fournisseurChemin.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourcePageContact = ({ fournisseurChemin }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get(
    '/:id',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const idRegion = String(requete.params.id);
      if (!estCodeRegion(idRegion.toUpperCase())) {
        throw new FichierInconnu(idRegion);
      }
      await reponse
        .contentType('text/html')
        .status(HttpStatusCode.Ok)
        .envoieFichierEnrichi(fournisseurChemin.jekyll.page('contacts'));
    })
  );

  return routeur;
};
export { ressourcePageContact };
