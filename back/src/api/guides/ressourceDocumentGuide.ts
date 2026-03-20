import { NextFunction, Request, Response, Router } from 'express';
import { UserAgent } from 'express-useragent';
import { DocumentGuideTelecharge } from '../../bus/evenements/documentGuideTelecharge';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourceDocumentGuide = ({ busEvenements, cellar }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get('/:nomFichier', async (requete: Request, reponse: Response, suite: NextFunction) => {
    try {
      const fluxCellar = await cellar.getStream(requete.params.nomFichier as string, 'GUIDES');
      if (!fluxCellar) {
        reponse.sendStatus(404);
        return;
      }

      reponse.contentType(fluxCellar.typeDeContenu);
      reponse.setHeader('content-length', fluxCellar.tailleDuContenu);
      reponse.set({
        'cache-control': 'public, max-age=3600, s-maxage=3600, must-revalidate, proxy-revalidate',
        pragma: '',
        expires: '3600',
        'surrogate-control': 'public, max-age=3600, s-maxage=3600, must-revalidate, proxy-revalidate',
      });
      fluxCellar.flux.pipe(reponse);
      fluxCellar.flux.on('error', (err) => {
        suite(err);
      });
      const source = requete.headers['user-agent'] ?? 'unknown';
      const parser = new UserAgent().hydrate(source);
      if (!parser.Agent.isBot) {
        await busEvenements.publie(
          new DocumentGuideTelecharge({
            nomFichier: requete.params.nomFichier as string,
            origine: requete.query.ref?.toString(),
          })
        );
      }
    } catch (erreur) {
      suite(erreur);
    }
  });

  return routeur;
};
