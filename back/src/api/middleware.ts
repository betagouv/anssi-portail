import { NextFunction, Request, Response } from 'express';
import { check } from 'express-validator';

type FonctionMiddleware = (
  requete: Request,
  reponse: Response,
  suite: NextFunction
) => Promise<void>;

export type Middleware = {
  aseptise: (...nomsParametres: string[]) => FonctionMiddleware;
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

  return {
    aseptise,
  };
};
