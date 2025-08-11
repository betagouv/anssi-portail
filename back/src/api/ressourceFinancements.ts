import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

export const ressourceFinancements = ({
  entrepotFinancement,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (_requete: Request, reponse: Response) => {
    const financements = await entrepotFinancement.tous();
    reponse.send(financements);
  });
  return routeur;
};
