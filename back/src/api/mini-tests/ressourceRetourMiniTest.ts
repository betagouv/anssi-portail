import { HttpStatusCode } from '@anssi-portail/axios';
import { Response, Router } from 'express';
import z from 'zod';
import { RetourMiniTestDonné } from '../../bus/evenements/retourMiniTestDonne.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { valideCorpsRequete } from '../zod.js';
import { schemaRessourceRetourTestMaturite } from '../testMaturite/ressourceRetourTestMaturite.schema.js';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;
import { estMiniTest } from '../../metier/mini-tests/mini-test.js';

const ressourceRetourMiniTest = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/:miniTest',
    valideCorpsRequete(schemaRessourceRetourTestMaturite),
    filetRouteAsynchrone(
      async (requete: CorpsDeRequeteTypee<z.output<typeof schemaRessourceRetourTestMaturite>>, reponse: Response) => {
        const miniTest = requete.params.miniTest;
        if (!estMiniTest(miniTest)) return reponse.sendStatus(HttpStatusCode.NotFound);

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
