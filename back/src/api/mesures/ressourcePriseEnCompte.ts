import { Request, Response, Router } from 'express';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourcePriseEnCompte = ({ middleware }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/:idMesure/prise-en-compte',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      return reponse.sendStatus(201);
    })
  );

  return routeur;
};
