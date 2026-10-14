import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceModeleAnnuaireDeCrise = (_config: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/modele-annuaire-de-crise.xlsx',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      const modèle = Buffer.from('un contenu');

      reponse
        .contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .attachment('modele-annuaire-de-crise.xlsx')
        .send(modèle);
    })
  );
  return routeur;
};
