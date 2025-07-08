import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { calculeStatistiques } from '../metier/statistiques';

export const ressourceStatistiques = ({
  entrepotUtilisateur,
  entrepotResultatTest,
  adaptateurMonAideCyber,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (_requete: Request, reponse: Response) => {
    const statistiques = await calculeStatistiques({
      entrepotResultatTest,
      adaptateurMonAideCyber,
      entrepotUtilisateur,
    });
    reponse.send(statistiques);
  });
  return routeur;
};
