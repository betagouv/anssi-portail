import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { detruisSession } from './session';
import { corpsVide, valideCorpsRequete } from './zod';
import { filetRouteAsynchrone } from './middleware';

const ressourcePageConnexion = ({ fournisseurChemin }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      detruisSession(requete, reponse);
      await reponse
        .contentType('text/html')
        .status(200)
        .envoieFichierEnrichi(fournisseurChemin.cheminPageJekyll('connexion'));
    })
  );

  return routeur;
};
export { ressourcePageConnexion };
