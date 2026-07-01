import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

export const ressourceFinancement = ({ entrepotFinancement }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:id',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const financement = await entrepotFinancement.parId(Number(requete.params.id));
      if (!financement) {
        reponse.sendStatus(404);
        return;
      }

      reponse.send(financement);
    })
  );
  return routeur;
};
