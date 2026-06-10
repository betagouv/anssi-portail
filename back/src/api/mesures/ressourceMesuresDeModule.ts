import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';

const ressourceMesuresDeModule = ({ entrepotMesure, middleware }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      const mesures = await entrepotMesure.tous();
      reponse.status(200).send(mesures.toSorted((a, b) => a.ordre - b.ordre));
    })
  );

  return routeur;
};

export { ressourceMesuresDeModule };
