import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourceQualification = ({ cellar }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get(
    '/:slug',
    async (requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        const tampon = await cellar.get(
          `/qualifications/${requete.params.slug}`
        );
        if (!tampon) {
          reponse.sendStatus(404);
          return;
        }

        reponse.contentType('application/pdf').status(200).send(tampon.contenu);
      } catch (erreur: Error | unknown) {
        suite(erreur);
      }
    }
  );

  return routeur;
};
export { ressourceQualification };
