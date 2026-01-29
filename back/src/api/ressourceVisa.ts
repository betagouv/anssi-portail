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
        const fluxCellar = await cellar.getStream(requete.params.slug, 'VISAS');
        if (!fluxCellar) {
          reponse.sendStatus(404);
          return;
        }

        reponse.contentType(fluxCellar.typeDeContenu);
        reponse.setHeader('content-length', fluxCellar.tailleDuContenu);
        reponse.set({
          'cache-control':
            'public, max-age=3600, s-maxage=3600, must-revalidate, proxy-revalidate',
          pragma: '',
          expires: '3600',
          'surrogate-control':
            'public, max-age=3600, s-maxage=3600, must-revalidate, proxy-revalidate',
        });
        fluxCellar.flux.pipe(reponse);

        fluxCellar.flux.on('error', (err) => {
          suite(err);
        });
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
