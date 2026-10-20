import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceModeleModificationsMotsDePasse = ({ middleware, fournisseurChemin }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requête: Request, réponse: Response) => {
      await réponse
        .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .attachment('modele-modifications-mots-de-passe.xlsx')
        .sendFile(fournisseurChemin.back.modèleModificationsMotsDePasse());
    })
  );
  return routeur;
};
