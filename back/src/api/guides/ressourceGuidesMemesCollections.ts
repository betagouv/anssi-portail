import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middleware.js';
import { valideParametresRequete } from '../zod.js';
import { guidePresentation } from './guidePresentation.js';
import { schemaParametersRessourceGuidesMemesCollections } from './ressourceGuidesMemesCollections.schema.js';

export const ressourceGuidesMemesCollections = ({ adaptateurEnvironnement, entrepotGuide }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:slug/memes-collections',
    valideParametresRequete(schemaParametersRessourceGuidesMemesCollections),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const guideCible = await entrepotGuide.parId(requete.params.slug as string);
      if (!guideCible) {
        reponse.sendStatus(404);
        return;
      }
      const guides = await guideCible.deMemesCollections(entrepotGuide);

      reponse.status(200).send(guides.map(guidePresentation(adaptateurEnvironnement)));
    })
  );

  return routeur;
};
