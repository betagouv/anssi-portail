import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { GuideTelecharge } from '../../bus/evenements/guideTelecharge';

export const ressourceDocumentGuide = ({
  busEvenements,
  cellar,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:nomFichier',
    async (requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        const documentCellar = await cellar.get(
          requete.params.nomFichier,
          'GUIDES'
        );
        if (!documentCellar) {
          reponse.sendStatus(404);
          return;
        }
        reponse
          .contentType(documentCellar.typeDeContenu)
          .status(200)
          .send(documentCellar.contenu);

        await busEvenements.publie(
          new GuideTelecharge({ id: requete.params.nomFichier })
        );
      } catch (erreur) {
        suite(erreur);
      }
    }
  );

  return routeur;
};
