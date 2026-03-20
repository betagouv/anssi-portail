import { NextFunction, Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourceDocumentGuide = ({ cellar }: ConfigurationServeur) => {
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
    } catch (erreur) {
      suite(erreur);
    }
  });

  return routeur;
};
