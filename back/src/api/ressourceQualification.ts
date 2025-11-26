import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourceQualification = ({ cellar }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get(
    '/:slug',
    async (requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        const documentCellar = await cellar.get(
          `/qualifications/${requete.params.slug}`
        );
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
export { ressourceQualification };
