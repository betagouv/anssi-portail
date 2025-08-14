import { ConfigurationServeur } from './configurationServeur';
import { Router, Request, Response } from 'express';
import { check } from 'express-validator';

export const ressourceFinancement = ({
  middleware,
  entrepotFinancement,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:id',
    [check('id').isNumeric().withMessage("L'id est invalide")],
    middleware.valide(),
    async (requete: Request, reponse: Response) => {
      const financement = await entrepotFinancement.parId(
        Number(requete.params.id)
      );

      if (!financement) {
        reponse.sendStatus(404);
        return;
      }

      reponse.send(financement);
    }
  );
  return routeur;
};
