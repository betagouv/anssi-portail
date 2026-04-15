import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { guidePresentation } from './guidePresentation';

const ressourceGuides = ({ adaptateurEnvironnement, entrepotGuide, entrepotGuideTravail }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    filetRouteAsynchrone(async (requete: Request, reponse: Response, suivante: NextFunction) => {
      try {
        const entrepot = requete.query.mode === 'travail' ? entrepotGuideTravail : entrepotGuide;
        const guides = await entrepot.tous();
        const guidesPublies = guides
          .filter((guide) => guide.estPublie())
          .map(guidePresentation(adaptateurEnvironnement));
        reponse.status(200).send(guidesPublies);
      } catch (e) {
        suivante(e);
      }
    })
  );

  return routeur;
};

export { ressourceGuides };
