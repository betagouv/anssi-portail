import { Response, Router } from 'express';
import z from 'zod';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { valideCorpsRequete } from '../zod';
import { schemaRessourceAvisMesure } from './ressourceAvisMesure.schema';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

const ressourceAvisMesure = ({ entrepotMesure }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/:idMesure/avis',
    valideCorpsRequete(schemaRessourceAvisMesure),
    filetRouteAsynchrone(
      async (requete: CorpsDeRequeteTypee<z.infer<typeof schemaRessourceAvisMesure>>, reponse: Response) => {
        const mesureTrouvee = await entrepotMesure.parId(requete.params.idMesure as string);
        if (!mesureTrouvee) {
          return reponse.sendStatus(404);
        }

        reponse.status(201).send();
      }
    )
  );

  return routeur;
};

export { ressourceAvisMesure };
