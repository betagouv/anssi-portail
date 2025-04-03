import { Router } from 'express';

const ressourceDemandesAide = (): Router => {
  const routeur = Router();

  routeur.post('/', async (_requete, reponse) => {
    reponse.sendStatus(201);
  });
  return routeur;
};

export { ressourceDemandesAide };
