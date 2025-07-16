import { Request, Response, Router } from 'express';
import { RepartitionResultatsTest } from '../../metier/repartitionResultatsTest';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourceRepartitionDesResultatsDeTest = ({
  entrepotResultatTest,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (_requete: Request, reponse: Response) => {
    const tousLesResultats =
      await entrepotResultatTest.tousEnOmettantUtilisateur();
    const repartitions = new RepartitionResultatsTest(
      tousLesResultats
    ).calculeRepartitionParNiveau();
    reponse.send(repartitions);
  });
  return routeur;
};
