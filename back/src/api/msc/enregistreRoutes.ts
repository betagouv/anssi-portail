import { HttpStatusCode } from '@anssi-portail/axios';
import { Express, RequestHandler } from 'express';

export const enregistreRouteDansExpress =
  (app: Express) =>
  (chemin: string, ...gestionnaires: RequestHandler[]) => {
    const redirigeSansSlashFinal: RequestHandler = (requête, réponse, suite) => {
      const cheminRequête = requête.originalUrl.split('?', 1)[0];

      const motifPlusieursSlashsdAffilé: RegExp = /^\/{2,}$/;
      const estRacineAvecPlusieursSlashs = chemin === '/' && motifPlusieursSlashsdAffilé.test(cheminRequête);

      const paramètres = requête.originalUrl.slice(cheminRequête.length);

      if (estRacineAvecPlusieursSlashs) {
        return réponse.redirect(HttpStatusCode.PermanentRedirect, `/${paramètres}`);
      }

      if (chemin !== '/' && cheminRequête.endsWith('/')) {
        const motifSlashFinal: RegExp = /\/+$/;
        const cheminNormalisé = cheminRequête.replace(motifSlashFinal, '');

        return réponse.redirect(HttpStatusCode.PermanentRedirect, `${cheminNormalisé}${paramètres}`);
      }

      suite();
    };

    return app.use(chemin, redirigeSansSlashFinal, ...gestionnaires);
  };
