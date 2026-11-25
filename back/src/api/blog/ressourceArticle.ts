import { HttpStatusCode, isAxiosError } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceArticle = ({ entrepôtArticle }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/kit-relais',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      try {
        const kitRelais = await entrepôtArticle.kitRelais();
        const { titre, tableDesMatières, description, contenu } = kitRelais;
        reponse.send({ titre, tableDesMatières, description, contenu });
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === HttpStatusCode.NotFound) {
          return reponse.sendStatus(HttpStatusCode.NotFound);
        }
        throw e;
      }
    })
  );

  routeur.get(
    '/:slug',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const article = await entrepôtArticle.articleDeBlogParSlug(requete.params.slug as string);
      if (!article) {
        reponse.sendStatus(HttpStatusCode.NotFound);
      }
      reponse.status(HttpStatusCode.Ok).send(article);
    })
  );
  return routeur;
};
