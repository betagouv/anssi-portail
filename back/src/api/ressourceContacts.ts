import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

export const ressourceContacts = ({ entrepôtContact }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      reponse.send({
        regionaux: await entrepôtContact.régionaux(),
        sectoriels: await entrepôtContact.sectoriels(),
        nationaux: await entrepôtContact.nationaux(),
      });
    })
  );
  return routeur;
};
