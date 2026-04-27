import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { corpsVide, valideCorpsRequete } from './zod';

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
