import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { valideCorpsRequete } from '../../zod.js';
import { schémaPostRéponsesHameçonnage } from './ressourceReponsesHameconnage.schema.js';

export const ressourceRéponsesHameçonnage = () => {
  const routeur = Router();

  routeur.post(
    '/',
    valideCorpsRequete(schémaPostRéponsesHameçonnage),
    filetRouteAsynchrone((_req, réponse) => {
      return réponse.sendStatus(HttpStatusCode.Created);
    })
  );

  return routeur;
};
