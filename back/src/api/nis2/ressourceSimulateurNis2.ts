import { Router } from 'express';

export const ressourceSimulateurNis2 = () => {
  const routeur = Router();

  routeur.post('/', async (requete, reponse) => {
    reponse.status(201).json(requete.body);
  });

  return routeur;
};
