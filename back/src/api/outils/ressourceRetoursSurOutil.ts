import { HttpStatusCode } from '@anssi-portail/axios';
import { Response, Router } from 'express';
import z from 'zod';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { schemaRetourUtilisateur } from '../retourUtilisateur.schema.js';
import { valideCorpsRequete } from '../zod.js';

import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

const IDENTIFIANTS_OUTILS_CONNUS = ['modele-annuaire-de-crise.xlsx', 'rappel-mise-a-jour-annuaire-contacts.ics'];

export const ressourceRetoursSurOutil = (_: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/:idOutil',
    valideCorpsRequete(schemaRetourUtilisateur),
    filetRouteAsynchrone(
      async (requête: CorpsDeRequeteTypee<z.output<typeof schemaRetourUtilisateur>>, réponse: Response) => {
        const identifiantOutil = requête.params.idOutil as string;
        if (!IDENTIFIANTS_OUTILS_CONNUS.includes(identifiantOutil)) {
          return réponse.sendStatus(HttpStatusCode.NotFound);
        }
        réponse.sendStatus(HttpStatusCode.Created);
      }
    )
  );
  return routeur;
};
