import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';

export const ressourceSessionDeGroupe = ({ entrepotSessionDeGroupe }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:code',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const session = await entrepotSessionDeGroupe.parCode(requete.params.code as string);
      reponse.sendStatus(session ? 200 : 404);
    })
  );
  return routeur;
};
