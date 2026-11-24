import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

export const ressourceObservatoire = ({ serviceObservatoire }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      const projets = await serviceObservatoire.donneesProjets();

      reponse.send({ projets });
    })
  );
  return routeur;
};
