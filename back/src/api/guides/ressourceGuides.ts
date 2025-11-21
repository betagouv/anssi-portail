import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { guidePresentation } from './guidePresentation';

const ressourceGuides = ({
  adaptateurEnvironnement,
  entrepotGuide,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    async (_requete: Request, reponse: Response, suivante: NextFunction) => {
      try {
        const guides = await entrepotGuide.tous();
        reponse
          .status(200)
          .send(guides.map(guidePresentation(adaptateurEnvironnement)));
      } catch (e) {
        suivante(e);
      }
    }
  );

  return routeur;
};

export { ressourceGuides };
