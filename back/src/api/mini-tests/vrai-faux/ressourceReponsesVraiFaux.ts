import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';
import { ConfigurationServeur } from '../../configurationServeur.js';

export const ressourceRéponsesVraiFaux = (_config: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requête, reponse) => {
      reponse.sendStatus(HttpStatusCode.Created);
    })
  );
  return routeur;
};
