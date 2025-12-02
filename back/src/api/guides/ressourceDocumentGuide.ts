import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourceDocumentGuide = ({ cellar }: ConfigurationServeur) => {
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
      } catch (erreur) {
        suite(erreur);
      }
    }
  );

  return routeur;
};
