import { Request, Response, Router } from 'express';

const ressourceGuides = () => {
  const routeur = Router();

  routeur.get('/', async (_requete: Request, reponse: Response) => {
    reponse.sendStatus(200);
  });

  return routeur;
};

export { ressourceGuides };
