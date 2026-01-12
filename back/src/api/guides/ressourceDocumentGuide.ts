import { NextFunction, Request, Response, Router } from 'express';
import { UserAgent } from 'express-useragent';
import { DocumentGuideTelecharge } from '../../bus/evenements/documentGuideTelecharge';
import { ConfigurationServeur } from '../configurationServeur';

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

        const source = requete.headers['user-agent'] ?? 'unknown';
        const parser = new UserAgent().hydrate(source);
        if (!parser.Agent.isBot) {
          await busEvenements.publie(
            new DocumentGuideTelecharge({
              nomFichier: requete.params.nomFichier,
            })
          );
        }
      } catch (erreur) {
        suite(erreur);
      }
    }
  );

  return routeur;
};
