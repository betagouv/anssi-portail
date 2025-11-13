import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

const ressourceGuides = ({ entrepotGuide }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    async (_requete: Request, reponse: Response, suivante: NextFunction) => {
      try {
        const guides = await entrepotGuide.tous();
        reponse.status(200).send(guides);
      } catch (e) {
        suivante(e);
      }
    }
  );

  return routeur;
};

export { ressourceGuides };
