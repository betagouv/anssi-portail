import { Request, Response, Router } from 'express';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';

const ressourceMesure = () => {
  const routeur = Router();

  routeur.get(
    '/:idMesure',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      reponse.sendStatus(200);
    })
  );

  return routeur;
};

export { ressourceMesure };
