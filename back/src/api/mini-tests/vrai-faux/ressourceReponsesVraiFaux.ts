import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import z from 'zod';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { valideCorpsRequete } from '../../zod.js';
import { schemaPostRéponsesVraiFaux } from './ressourceReponsesVraiFaux.schemas.js';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceRéponsesVraiFaux = (_config: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaPostRéponsesVraiFaux),
    filetRouteAsynchrone(async (_requête: CorpsDeRequeteTypee<z.infer<typeof schemaPostRéponsesVraiFaux>>, reponse) => {
      reponse.sendStatus(HttpStatusCode.Created);
    })
  );
  return routeur;
};
