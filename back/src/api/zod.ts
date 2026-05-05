import { NextFunction, Request, Response } from 'express';
import * as z from 'zod';

export const valideRequete =
  <TZod extends z.ZodType, TReq extends z.infer<TZod>>(objet: TZod) =>
  async (
    requete: Request<unknown, unknown, unknown, unknown, never> | TReq,
    reponse: Response,
    suite: NextFunction
  ) => {
    const resultat = objet.safeParse(requete) as z.ZodSafeParseResult<z.core.output<TZod>>;
    if (!resultat.success) return reponse.sendStatus(400);
    return suite();
  };

export const valideParametresRequete =
  <TZod extends z.ZodType, TParams extends z.infer<TZod>>(objet: TZod) =>
  async (requete: Request<TParams, unknown, unknown, unknown, never>, reponse: Response, suite: NextFunction) => {
    const resultat = objet.safeParse(requete.params);

    if (!resultat.success) {
      return reponse.sendStatus(404);
    }

    return suite();
  };

export const valideCorpsRequete =
  <TZod extends z.ZodType, TBody extends z.infer<TZod>>(objet: TZod) =>
  async (requete: Request<unknown, unknown, TBody, unknown, never>, reponse: Response, suite: NextFunction) => {
    const resultat = objet.safeParse(requete.body);

    if (!resultat.success) return reponse.status(400).send(z.flattenError(resultat.error));

    // Ici, on veut bel et bien réécrire la requête, car c'est comme ça qu'expressjs est conçu.
    // On réassigne pour que les suivants récupèrent le contenu assaini par Zod.
    requete.body = resultat.data as TBody;

    return suite();
  };

export const corpsVide = z.strictObject({});
