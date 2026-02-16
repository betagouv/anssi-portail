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
        const guidesPublies = guides
          .filter((guide) => guide.estPublie())
          .map(guidePresentation(adaptateurEnvironnement));
        reponse.status(200).send(guidesPublies);
      } catch (e) {
        suivante(e);
      }
    }
  );

  return routeur;
};

export { ressourceGuides };
