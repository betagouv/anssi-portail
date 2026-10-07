import { HttpStatusCode } from '@anssi-portail/axios';
import { Response, Router } from 'express';
import z from 'zod';
import { RetourArticleDonné } from '../../bus/evenements/retourArticleDonne.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { valideCorpsRequete } from '../zod.js';
import { schemaRessourceRetourArticle } from './ressourceRetourArticle.schema.js';

import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

const ressourceAvisArticle = ({ entrepôtArticle, busEvenements }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/:slugArticle/avis',
    valideCorpsRequete(schemaRessourceRetourArticle),
    filetRouteAsynchrone(
      async (requête: CorpsDeRequeteTypee<z.output<typeof schemaRessourceRetourArticle>>, réponse: Response) => {
        const { retour, commentaire } = requête.body;
        const slug = requête.params.slugArticle as string;

        const articleExistant = await entrepôtArticle.existe(slug);

        if (!articleExistant) return réponse.sendStatus(HttpStatusCode.NotFound);

        await busEvenements.publie(
          new RetourArticleDonné({
            slug,
            retour,
            ...(retour === 'NEGATIF' && { commentaire }),
          })
        );

        réponse.status(HttpStatusCode.Created).send();
      }
    )
  );

  return routeur;
};

export { ressourceAvisArticle };
