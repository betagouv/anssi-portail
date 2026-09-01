import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

export const ressourceVraiFaux = () => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete, reponse) => {
      reponse.sendStatus(HttpStatusCode.Ok);
    })
  );
  return routeur;
};
