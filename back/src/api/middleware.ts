import {NextFunction, Request, Response} from 'express';
import {check, validationResult} from 'express-validator';

type FonctionMiddleware = (
  requete: Request,
  reponse: Response,
  suite: NextFunction
) => Promise<void>;

export type Middleware = {
  aseptise: (...nomsParametres: string[]) => FonctionMiddleware;
  valide: () => FonctionMiddleware;
  interdisLaMiseEnCache: FonctionMiddleware;
};

export const fabriqueMiddleware = (): Middleware => {
  const aseptise =
    (...nomsParametres: string[]) =>
      async (requete: any, _reponse: any, suite: any) => {
        const aseptisations = nomsParametres.map((p) =>
          check(p).trim().escape().run(requete)
        );
        await Promise.all(aseptisations);
        suite();
      };

  const valide = () =>
    async (requete: any, reponse: any, suite: any) => {
      const erreurs = validationResult(requete);
      if (!erreurs.isEmpty()) {
        reponse.status(400).json({erreur: erreurs.array()[0].msg});
        return;
      }
      suite();
    }

  const interdisLaMiseEnCache = async (_requete: Request, reponse: Response, suite: NextFunction) => {
    reponse.set({
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      pragma: 'no-cache',
      expires: '0',
      'surrogate-control': 'no-store',
    });
    suite();
  };

  return {
    aseptise,
    valide,
    interdisLaMiseEnCache
  };
};
