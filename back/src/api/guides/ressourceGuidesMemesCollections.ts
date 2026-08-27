import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { valideParametresRequete } from '../zod.js';
import { guidePresentation } from '../../presentation/guides/guidePresentation.js';
import { schemaParametersRessourceGuidesMemesCollections } from './ressourceGuidesMemesCollections.schema.js';

export const ressourceGuidesMemesCollections = ({ adaptateurEnvironnement, entrepotGuide }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:slug/memes-collections',
    valideParametresRequete(schemaParametersRessourceGuidesMemesCollections),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const guideCible = await entrepotGuide.parId(requete.params.slug as string);
      if (!guideCible) {
        reponse.sendStatus(HttpStatusCode.NotFound);
        return;
      }
      const guides = await guideCible.deMemesCollections(entrepotGuide);

      reponse.status(HttpStatusCode.Ok).send(guides.map(guidePresentation(adaptateurEnvironnement)));
    })
  );

  return routeur;
};
