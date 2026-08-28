import { HttpStatusCode } from '@anssi-portail/axios';
import { Response, Router } from 'express';
import z from 'zod';
import { RetourTestMaturitéDonné } from '../../bus/evenements/retourTestMaturiteDonne.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { valideCorpsRequete } from '../zod.js';
import { schemaRessourceRetourTestMaturite } from './ressourceRetourTestMaturite.schema.js';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

const ressourceRetourTestMaturite = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/',
    valideCorpsRequete(schemaRessourceRetourTestMaturite),
    filetRouteAsynchrone(
      async (requete: CorpsDeRequeteTypee<z.infer<typeof schemaRessourceRetourTestMaturite>>, reponse: Response) => {
        const retour = requete.body.retour;

        await busEvenements.publie(
          new RetourTestMaturitéDonné({
            retour,
            ...(retour === 'NEGATIF' && { commentaire: requete.body.commentaire }),
          })
        );

        reponse.status(HttpStatusCode.Created).send();
      }
    )
  );

  return routeur;
};

export { ressourceRetourTestMaturite };
