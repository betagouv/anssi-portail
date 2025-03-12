import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { AdaptateurJWT } from './adaptateurJWT';

type FonctionMiddleware = (
  requete: Request,
  reponse: Response,
  suite: NextFunction
) => Promise<void>;

export type Middleware = {
  aseptise: (...nomsParametres: string[]) => FonctionMiddleware;
  valide: () => FonctionMiddleware;
  interdisLaMiseEnCache: FonctionMiddleware;
  verifieJWT: FonctionMiddleware;
};

export const fabriqueMiddleware = ({ adaptateurJWT }: { adaptateurJWT: AdaptateurJWT }): Middleware => {
  const aseptise =
    (...nomsParametres: string[]) =>
    async (requete: any, _reponse: any, suite: any) => {
      const aseptisations = nomsParametres.map((p) =>
        check(p).trim().escape().run(requete)
      );
      await Promise.all(aseptisations);
      suite();
    };

  const valide = () => async (requete: any, reponse: any, suite: any) => {
    const erreurs = validationResult(requete);
    if (!erreurs.isEmpty()) {
      reponse.status(400).json({ erreur: erreurs.array()[0].msg });
      return;
    }
    suite();
  };

  const interdisLaMiseEnCache = async (
    _requete: Request,
    reponse: Response,
    suite: NextFunction
  ) => {
    reponse.set({
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      pragma: 'no-cache',
      expires: '0',
      'surrogate-control': 'no-store',
    });
    suite();
  };

  const verifieJWT = async (
    requete: Request & { emailUtilisateurCourant?: string; },
    reponse: Response,
    suite: NextFunction
  ) => {
    if(!requete.session?.token) {
      reponse.status(401);
      return;
    }

    try {
      const { email } = adaptateurJWT.decode(requete.session.token);
      requete.emailUtilisateurCourant = email;
      suite();
    } catch(e) {
      reponse.status(401);
    }
  };

  return {
    aseptise,
    valide,
    verifieJWT,
    interdisLaMiseEnCache,
  };
};
