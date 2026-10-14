import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceModeleAnnuaireDeCrise = ({ fournisseurChemin }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/modele-annuaire-de-crise.xlsx',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requête: Request, réponse: Response, suite: NextFunction) => {
      réponse
        .attachment('modele-annuaire-de-crise.xlsx')
        .sendFile(fournisseurChemin.back.modèleAnnuaireDeCrise(), (erreur) => {
          if (erreur) suite(erreur); // sendFile ne rejette pas d'erreur, il faut la propager manuellement
        });
    })
  );
  return routeur;
};
