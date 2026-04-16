import { NextFunction, Request, Response } from 'express';
import { AdaptateurCellar, CleDuBucket } from '../infra/adaptateurCellar';
import { filetRouteAsynchrone } from './middleware';

export type FonctionDocumentManquant = (reponse: Response, nomDuDocument: string) => Promise<void>;
export const gereDocumentManquantSimplement = async (reponse: Response) => {
  reponse.sendStatus(404);
};

export const fabriqueGestionnaireRessourceCellar = (
  cellar: AdaptateurCellar,
  cleDuBucket: CleDuBucket,
  fnDocumentManquant: FonctionDocumentManquant = gereDocumentManquantSimplement
) =>
  filetRouteAsynchrone(async (requete: Request, reponse: Response, suite: NextFunction) => {
    try {
      const nomDuDocument = requete.params.slug as string;
      const fluxCellar = await cellar.getStream(nomDuDocument, cleDuBucket);
      if (!fluxCellar) {
        await fnDocumentManquant(reponse, nomDuDocument);
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
