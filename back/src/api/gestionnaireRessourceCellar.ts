import { NextFunction, Request, Response } from 'express';
import { pipeline } from 'node:stream/promises';
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

      // Si le client a déjà fermé la connexion, on abandonne proprement
      if (reponse.destroyed || reponse.closed) {
        fluxCellar.flux.destroy();
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

      // On écoute la déconnexion client pour détruire le flux source
      const detruireFluxSiDeconnexion = () => {
        fluxCellar.flux.destroy();
      };
      requete.on('close', detruireFluxSiDeconnexion);

      try {
        await pipeline(fluxCellar.flux, reponse);
      } catch (erreurPipeline: Error | unknown) {
        // On ignore les erreurs dues à une déconnexion cliente volontaire
        const estDeconnexionClient =
          reponse.destroyed ||
          (erreurPipeline instanceof Error &&
            (erreurPipeline.message.includes('closed') ||
              erreurPipeline.message.includes('destroyed') ||
              (erreurPipeline as NodeJS.ErrnoException).code === 'ERR_STREAM_DESTROYED' ||
              (erreurPipeline as NodeJS.ErrnoException).code === 'ECONNRESET' ||
              (erreurPipeline as NodeJS.ErrnoException).code === 'EPIPE'));

        if (!estDeconnexionClient) {
          throw erreurPipeline;
        }
      } finally {
        requete.off('close', detruireFluxSiDeconnexion);
      }
    } catch (erreur: Error | unknown) {
      suite(erreur);
    }
  });
