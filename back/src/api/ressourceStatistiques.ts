import { Request, Response, Router } from 'express';
import { calculeStatistiques } from '../metier/statistiques';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { corpsVide, valideCorpsRequete } from './zod';

export const ressourceStatistiques = ({
  entrepotUtilisateur,
  entrepotResultatTest,
  adaptateurMonAideCyber,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
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
