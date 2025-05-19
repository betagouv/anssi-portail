import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourceResultatsSessionDeGroupe = ({
  entrepotSessionDeGroupe,
  middleware,
  entrepotResultatTest,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:code/resultats',
    middleware.aseptise('code'),
    async (requete: Request, reponse: Response) => {
      const session = await entrepotSessionDeGroupe.parCode(
        requete.params.code
      );
      if (!session) {
        reponse.sendStatus(404);
        return;
      }

      const resultatsSession =
        await session.resultatSession(entrepotResultatTest);
      reponse.status(200).send(resultatsSession);
    }
  );
  return routeur;
};
