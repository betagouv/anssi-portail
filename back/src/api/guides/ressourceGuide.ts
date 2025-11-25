import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { guidePresentation } from './guidePresentation';

const ressourceGuide = ({
  adaptateurEnvironnement,
  entrepotGuide,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:slug',
    async (requete: Request, reponse: Response, suivante: NextFunction) => {
      try {
        const guide = await entrepotGuide.parId(requete.params.slug);
        if (!guide) {
          reponse.sendStatus(404);
          return;
        }

        reponse
          .status(200)
          .send(guidePresentation(adaptateurEnvironnement)(guide));
      } catch (err) {
        suivante(err);
      }
    }
  );

  routeur.get(
    '/:slug/memes-collections',
    (_requete: Request, reponse: Response) => {
      reponse.sendStatus(200);
    }
  );

  return routeur;
};

export { ressourceGuide };
