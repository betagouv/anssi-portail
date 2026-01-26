import { NextFunction, Request, Response, Router } from 'express';
import { VisaTelecharge } from '../bus/evenements/visaTelecharge';
import { ConfigurationServeur } from './configurationServeur';

export const ressourceVisa = ({
  busEvenements,
  cellar,
}: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get(
    '/:slug',
    async (requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        const documentCellar = await cellar.get(requete.params.slug, 'VISAS');
        if (!documentCellar) {
          reponse.sendStatus(404);
          return;
        }

        reponse
          .contentType(documentCellar.typeDeContenu)
          .status(200)
          .send(documentCellar.contenu);

        await busEvenements.publie(
          new VisaTelecharge({
            nomFichier: requete.params.slug,
          })
        );
      } catch (erreur: Error | unknown) {
        suite(erreur);
      }
    }
  );

  return routeur;
};
