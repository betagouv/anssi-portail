import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

export const ressourceContacts = ({ entrepotContact }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      reponse.send({
        regionaux: await entrepotContact.regionaux(),
        sectoriels: await entrepotContact.sectoriels(),
        nationaux: await entrepotContact.nationaux(),
      });
    })
  );
  return routeur;
};
