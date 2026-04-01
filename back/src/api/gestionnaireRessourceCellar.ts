import { NextFunction, Request, Response } from 'express';
import { AdaptateurCellar, CleDuBucket } from '../infra/adaptateurCellar';
import { filetRouteAsynchrone } from './middleware';

export const fabriqueGestionnaireRessourceCellar = (cellar: AdaptateurCellar, cleDuBucket: CleDuBucket) =>
  filetRouteAsynchrone(async (requete: Request, reponse: Response, suite: NextFunction) => {
    try {
      const fluxCellar = await cellar.getStream(requete.params.slug as string, cleDuBucket);
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
    } catch (erreur: Error | unknown) {
      suite(erreur);
    }
  });
