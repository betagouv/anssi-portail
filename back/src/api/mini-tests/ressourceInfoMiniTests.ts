import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceInfoMiniTests = ({ entrepotReactionMiniTest, entrepotResultatTest }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      const compteurMaturitéCyber = await entrepotResultatTest.taille();

      const réactions = await entrepotReactionMiniTest.tous();
      reponse.send({
        compteurs: {
          MaturiteCyber: compteurMaturitéCyber,
        },
        réactions: réactions.reduce(
          (acc, réaction) => {
            if (!acc[réaction.id]) {
              acc[réaction.id] = {};
            }
            acc[réaction.id][réaction.typeRéaction] = réaction.compteur;
            return acc;
          },
          {} as Record<string, Record<string, number>>
        ),
      });
    })
  );
  return routeur;
};
