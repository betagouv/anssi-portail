import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

export const ressourceRobotsTxt = ({ fournisseurChemin }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('', valideCorpsRequete(corpsVide), (_requete: Request, reponse: Response) => {
    reponse.type('text/plain');
    reponse.sendFile(fournisseurChemin.ressourceDeBase('robots.txt'));
  });
  return routeur;
};
