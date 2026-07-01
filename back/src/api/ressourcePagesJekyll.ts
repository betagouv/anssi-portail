import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { corpsVide, valideCorpsRequete } from './zod.js';
import { filetRouteAsynchrone } from './middleware.js';

const ressourcePagesJekyll = ({ fournisseurChemin }: ConfigurationServeur, nomPage: string): Router => {
  const routeur = Router();

  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      await reponse
        .contentType('text/html')
        .status(200)
        .envoieFichierEnrichi(fournisseurChemin.cheminPageJekyll(nomPage));
    })
  );

  return routeur;
};

export { ressourcePagesJekyll };
