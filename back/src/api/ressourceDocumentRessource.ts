import { NextFunction, Request, Response, Router } from 'express';

export const ressourceDocumentRessource = () => {
  const routeur = Router();

  routeur.get('/:nomFichier', async (_requete: Request, reponse: Response, _suite: NextFunction) => {
    reponse.sendStatus(200);
  });

  return routeur;
};
