import { Express, NextFunction, Request, Response } from 'express';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { erreurPageInterdite, erreurPageNonTrouvée, ErreurTraverséeDeChemin } from '../../erreurs.js';
import { FichierInconnu } from '../../fournisseurChemin.js';

export const configureLaGestionDErreur = (app: Express, configurationServeur: ConfigurationServeur) => {
  const { adaptateurGestionErreur, fournisseurChemin } = configurationServeur;

  app.use((erreur: unknown, _requete: Request, reponse: Response, suite: NextFunction) => {
    if (erreur instanceof FichierInconnu) {
      return erreurPageNonTrouvée(reponse, fournisseurChemin);
    }
    if (erreur instanceof ErreurTraverséeDeChemin) {
      return erreurPageInterdite(reponse);
    }
    suite(erreur);
  });

  app.use(adaptateurGestionErreur.controleurErreurs);

  app.use((_requete: Request, reponse: Response) => {
    return erreurPageNonTrouvée(reponse, fournisseurChemin);
  });
};
