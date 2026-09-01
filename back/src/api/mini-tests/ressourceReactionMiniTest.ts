import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { IdentifiantMiniTest, RéactionMiniTest, TypeRéaction } from '../../metier/mini-tests/reactionMiniTest.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { valideParametresRequete } from '../zod.js';
import { schemaParametresRessourceReactionMiniTest } from './ressourceReactionMiniTest.schema.js';

export const ressourceReactionMiniTest = ({ entrepotReactionMiniTest }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/:miniTest/:typeReaction',
    valideParametresRequete(schemaParametresRessourceReactionMiniTest),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const miniTest = requete.params.miniTest as IdentifiantMiniTest;
      const typeReaction = requete.params.typeReaction as TypeRéaction;

      const réactionsMiniTest = await entrepotReactionMiniTest.tous();
      let réactionMiniTest = réactionsMiniTest.find((r) => r.id === miniTest && r.typeRéaction === typeReaction);

      if (réactionMiniTest) {
        réactionMiniTest.ajoute();
        await entrepotReactionMiniTest.metsÀJour(réactionMiniTest);
      } else {
        réactionMiniTest = new RéactionMiniTest(miniTest, typeReaction, 1);
        await entrepotReactionMiniTest.ajoute(réactionMiniTest);
      }

      reponse.sendStatus(HttpStatusCode.Created);
    })
  );

  routeur.delete(
    '/:miniTest/:typeReaction',
    valideParametresRequete(schemaParametresRessourceReactionMiniTest),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const miniTest = requete.params.miniTest as IdentifiantMiniTest;
      const typeReaction = requete.params.typeReaction as TypeRéaction;

      const réactionsMiniTest = await entrepotReactionMiniTest.tous();
      const réactionMiniTest = réactionsMiniTest.find((r) => r.id === miniTest && r.typeRéaction === typeReaction);
      if (!réactionMiniTest) {
        return reponse.sendStatus(HttpStatusCode.NotFound);
      }

      réactionMiniTest.retire();
      await entrepotReactionMiniTest.metsÀJour(réactionMiniTest);

      reponse.sendStatus(HttpStatusCode.Ok);
    })
  );

  return routeur;
};
