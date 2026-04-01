import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { calculeStatistiques } from '../metier/statistiques';
import { filetRouteAsynchrone } from './middleware';

export const ressourceStatistiques = ({
  entrepotUtilisateur,
  entrepotResultatTest,
  adaptateurMonAideCyber,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      const statistiques = await calculeStatistiques({
        entrepotResultatTest,
        adaptateurMonAideCyber,
        entrepotUtilisateur,
      });
      reponse.send(statistiques);
    })
  );
  return routeur;
};
