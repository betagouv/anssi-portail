import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';

const ressourceMesuresDeModule = ({ entrepotMesure }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      const mesures = await entrepotMesure.tous();
      reponse.status(200).send(mesures);
    })
  );

  return routeur;
};

export { ressourceMesuresDeModule };
