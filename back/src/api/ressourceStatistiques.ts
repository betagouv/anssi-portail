import { Request, Response, Router } from 'express';
import { calculeStatistiques } from '../metier/statistiques.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

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
