import { Request, Response, Router } from 'express';

import { HttpStatusCode } from '@anssi-portail/axios';

import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

export const ressourceResultatsSessionDeGroupe = ({
  entrepotSessionDeGroupe,
  entrepôtRésultatTestMaturité,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:code/resultats',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const session = await entrepotSessionDeGroupe.parCode(requete.params.code as string);
      if (!session) {
        reponse.sendStatus(HttpStatusCode.NotFound);
        return;
      }

      const resultatsSession = await session.resultatSession(entrepôtRésultatTestMaturité);
      reponse.status(HttpStatusCode.Ok).send(resultatsSession);
    })
  );
  return routeur;
};
