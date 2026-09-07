import { HttpStatusCode } from '@anssi-portail/axios';
import { Response, Router } from 'express';
import z from 'zod';
import { RetourMiniTestDonné } from '../../bus/evenements/retourMiniTestDonne.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { valideCorpsRequete } from '../zod.js';
import { schemaRessourceRetourTestMaturite } from '../testMaturite/ressourceRetourTestMaturite.schema.js';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;
import { MiniTest } from '../../metier/mini-tests/mini-test.js';

const ressourceRetourMiniTest = ({ busEvenements }: ConfigurationServeur, miniTest: MiniTest) => {
  const routeur = Router();

  routeur.post(
    '/',
    valideCorpsRequete(schemaRessourceRetourTestMaturite),
    filetRouteAsynchrone(
      async (requete: CorpsDeRequeteTypee<z.output<typeof schemaRessourceRetourTestMaturite>>, reponse: Response) => {
        const retour = requete.body.retour;

        await busEvenements.publie(
          new RetourMiniTestDonné({
            retour,
            miniTest,
            ...(retour === 'NEGATIF' && { commentaire: requete.body.commentaire }),
          })
        );

        reponse.status(HttpStatusCode.Created).send();
      }
    )
  );

  return routeur;
};

export { ressourceRetourMiniTest };
