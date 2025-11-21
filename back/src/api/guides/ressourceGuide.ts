import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

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

        reponse.status(200).send({
          ...guide,
          nomImage: undefined,
          image: guide.nomImage
            ? {
                petite: `${adaptateurEnvironnement.urlCellar()}/guides/${guide.id}/${guide.nomImage}-234.avif`,
                grande: `${adaptateurEnvironnement.urlCellar()}/guides/${guide.id}/${guide.nomImage}-588.avif`,
              }
            : null,
        });
      } catch (err) {
        suivante(err);
      }
    }
  );

  return routeur;
};

export { ressourceGuide };
