import { HttpStatusCode, isAxiosError } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import z from 'zod';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourcePageCrisp = ({ cmsCrisp }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:id',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const idArticle = requete.params.id as string;

      if (!idArticle) {
        reponse.sendStatus(HttpStatusCode.NotFound);
        return;
      }

      if (!z.uuid().safeParse(idArticle).success) {
        return reponse.sendStatus(HttpStatusCode.BadRequest);
      }

      try {
        const pageHtmlCrisp = await cmsCrisp.recupereArticle(idArticle);
        const { titre, tableDesMatieres, description, contenu } = pageHtmlCrisp;
        reponse.send({ titre, description, contenu, tableDesMatieres });
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === HttpStatusCode.NotFound) {
          return reponse.sendStatus(HttpStatusCode.NotFound);
        }
        throw e;
      }
    })
  );
  return routeur;
};

export { ressourcePageCrisp };
