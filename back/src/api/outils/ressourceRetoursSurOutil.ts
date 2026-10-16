import { HttpStatusCode } from '@anssi-portail/axios';
import { Response, Router } from 'express';
import z from 'zod';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { schemaRetourUtilisateur } from '../retourUtilisateur.schema.js';
import { valideCorpsRequete } from '../zod.js';

import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceRetoursSurOutil = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/:idOutil',
    valideCorpsRequete(schemaRetourUtilisateur),
    filetRouteAsynchrone(
      async (_requête: CorpsDeRequeteTypee<z.output<typeof schemaRetourUtilisateur>>, réponse: Response) => {
        réponse.sendStatus(HttpStatusCode.Created);
      }
    )
  );
  return routeur;
};
