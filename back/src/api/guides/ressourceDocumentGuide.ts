import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourceDocumentGuide = ({ cellar }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:nomFichier',
    async (requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        const tampon = await cellar.get(`/guides/${requete.params.nomFichier}`);
        if (!tampon) {
          reponse.sendStatus(404);
          return;
        }
        reponse.status(200).send(tampon);
      } catch (erreur) {
        suite(erreur);
      }
    }
  );

  return routeur;
};
