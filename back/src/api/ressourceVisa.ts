import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

export const ressourceVisa = ({ cellar }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get(
    '/:slug',
    async (requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        const documentCellar = await cellar.get(requete.params.slug, 'VISAS');
        if (!documentCellar) {
          reponse.sendStatus(404);
          return;
        }

        reponse
          .contentType('application/pdf')
          .status(200)
          .send(documentCellar.contenu);
      } catch (erreur: Error | unknown) {
        suite(erreur);
      }
    }
  );

  return routeur;
};
