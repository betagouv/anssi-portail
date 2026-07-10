import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';
import { guidePresentation } from '../../presentation/guides/guidePresentation.js';

const ressourceGuide = ({ adaptateurEnvironnement, entrepotGuide }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:slug',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response, suivante: NextFunction) => {
      try {
        const guide = await entrepotGuide.parId(requete.params.slug as string);
        if (!guide) {
          reponse.sendStatus(404);
          return;
        }

        reponse.status(200).send(guidePresentation(adaptateurEnvironnement)(guide));
      } catch (err) {
        suivante(err);
      }
    })
  );

  return routeur;
};

export { ressourceGuide };
