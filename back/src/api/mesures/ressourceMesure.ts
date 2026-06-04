import { Request, Response, Router } from 'express';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';
import { ConfigurationServeur } from '../configurationServeur';
import { mesurePresentation } from './mesurePresentation';

const ressourceMesure = ({ entrepotMesure, entrepotExigence }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/:idMesure',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      const mesureTrouvee = await entrepotMesure.parId(_requete.params.idMesure as string);
      if (!mesureTrouvee) {
        return reponse.sendStatus(404);
      }
      const mesurePresentee = await mesurePresentation(mesureTrouvee, entrepotExigence);
      reponse.status(200).send(mesurePresentee);
    })
  );

  return routeur;
};

export { ressourceMesure };
