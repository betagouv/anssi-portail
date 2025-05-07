import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { SessionDeGroupe } from '../../metier/sessionDeGroupe';

export const ressourceSessionsDeGroupe = ({
  entrepotSessionDeGroupe,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post('/', async (_: Request, reponse: Response) => {
    await entrepotSessionDeGroupe.ajoute(new SessionDeGroupe());
    reponse.sendStatus(201);
  });
  return routeur;
};
