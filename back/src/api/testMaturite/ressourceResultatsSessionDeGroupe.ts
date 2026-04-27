import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';

export const ressourceResultatsSessionDeGroupe = ({
  entrepotSessionDeGroupe,
  entrepotResultatTest,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:code/resultats',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const session = await entrepotSessionDeGroupe.parCode(requete.params.code as string);
      if (!session) {
        reponse.sendStatus(404);
        return;
      }

      const resultatsSession = await session.resultatSession(entrepotResultatTest);
      reponse.status(200).send(resultatsSession);
    })
  );
  return routeur;
};
