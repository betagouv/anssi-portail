import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceRetoursSurOutil = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/:idOutil',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requête: Request, réponse: Response) => {
      réponse.sendStatus(HttpStatusCode.Created);
    })
  );
  return routeur;
};
