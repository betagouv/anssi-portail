import { Request, Response, Router } from 'express';
import { RepartitionResultatsTest } from '../../metier/repartitionResultatsTest';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourceRepartitionDesResultatsDeTest = ({
  entrepotResultatTest,
  adaptateurEnvironnement,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (_requete: Request, reponse: Response) => {
    const tousLesResultats =
      await entrepotResultatTest.tousEnOmettantUtilisateur();
    if (
      tousLesResultats.length <
      adaptateurEnvironnement.repartition().nombreMinimumDeResultats()
    ) {
      reponse.sendStatus(451);
      return;
    }
    const repartitions = new RepartitionResultatsTest(
      tousLesResultats
    ).calculeRepartitionParNiveau();
    reponse.send(repartitions);
  });

  return routeur;
};
