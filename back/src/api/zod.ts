import * as z from 'zod';
import { Request, Response, NextFunction } from 'express';

export const valideBody =
  <TZod extends z.ZodType, TBody extends z.infer<TZod>>(objet: TZod) =>
  async (requete: Request<unknown, unknown, TBody, unknown, never>, reponse: Response, suite: NextFunction) => {
    const resultat = objet.safeParse(requete.body);

    if (!resultat.success) return reponse.sendStatus(400);

    // Ici, on veut bel et bien réécrire la requête, car c'est comme ça qu'expressjs est conçu.
    // On réassigne pour que les suivants récupèrent le contenu assaini par Zod.
    requete.body = resultat.data as TBody;

    return suite();
  };
