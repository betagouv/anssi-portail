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

      const fichier = fs.readFileSync(fournisseurChemin.cheminPageJekyll("connexion"), "utf-8")
      const nonceAleatoire = randomBytes(16).toString("base64");
      const avecNonce = fichier.replace("%%NONCE%%", nonceAleatoire);

      reponse
        .contentType('text/html')
        .status(200)
        .send(avecNonce);
    }
  );

  return routeur;
};
export { ressourcePageConnexion };
