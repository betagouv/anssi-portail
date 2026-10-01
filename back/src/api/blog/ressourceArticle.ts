import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceArticle = ({ entrepôtArticle }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:slug',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const article = await entrepôtArticle.parSlug(requete.params.slug as string);
      if (!article) {
        reponse.sendStatus(HttpStatusCode.NotFound);
      }
      reponse.status(HttpStatusCode.Ok).send(article);
    })
  );
  return routeur;
};
