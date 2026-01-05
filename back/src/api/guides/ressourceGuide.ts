import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { guidePresentation } from './guidePresentation';
import { GuideTelecharge } from '../../bus/evenements/guideTelecharge';

const ressourceGuide = ({
  adaptateurEnvironnement,
  busEvenements,
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

        await busEvenements.publie(
          new GuideTelecharge({ id: guide.id, nom: guide.nom })
        );

        reponse
          .status(200)
          .send(guidePresentation(adaptateurEnvironnement)(guide));
      } catch (err) {
        suivante(err);
      }
    }
  );

  return routeur;
};

export { ressourceGuide };
