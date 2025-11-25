import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { guidePresentation } from './guidePresentation';

export const ressourceGuidesMemesCollections = ({
  adaptateurEnvironnement,
  entrepotGuide,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:slug/memes-collections',
    async (requete: Request, reponse: Response) => {
      const guideCible = await entrepotGuide.parId(requete.params.slug);
      if (!guideCible) {
        reponse.sendStatus(404);
        return;
      }
      const guides = await guideCible.deMemesCollections(entrepotGuide);

      reponse
        .status(200)
        .send(guides.map(guidePresentation(adaptateurEnvironnement)));
    }
  );

  return routeur;
};
