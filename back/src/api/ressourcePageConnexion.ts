import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import * as fs from 'node:fs';
import { randomBytes } from 'node:crypto';

const ressourcePageConnexion = (
  { fournisseurChemin }: ConfigurationServeur,
): Router => {
  const routeur = Router();

  routeur.get(
    '/',
    (_requete: Request, reponse: Response) => {
      reponse.clearCookie('session');

      reponse
        .contentType('text/html')
        .status(200)
        .sendFileAvecNonce(fournisseurChemin.cheminPageJekyll("connexion"));
    }
  );

  return routeur;
};
export { ressourcePageConnexion };
