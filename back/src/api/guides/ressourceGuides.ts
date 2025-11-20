import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

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
        reponse.status(200).send(
          guides.map((guide) => ({
            ...guide,
            nomImage: undefined,
            image: guide.nomImage
              ? {
                  petite: `${adaptateurEnvironnement.urlCellar()}/guides/${guide.id}/${guide.nomImage}-234.avif`,
                  grande: `${adaptateurEnvironnement.urlCellar()}/guides/${guide.id}/${guide.nomImage}-588.avif`,
                }
              : null,
          }))
        );
      } catch (e) {
        suivante(e);
      }
    }
  );

  return routeur;
};

export { ressourceGuides };
