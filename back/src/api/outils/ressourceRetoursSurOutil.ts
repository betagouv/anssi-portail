import { HttpStatusCode } from '@anssi-portail/axios';
import { Response, Router } from 'express';
import z from 'zod';
import { RetourOutilDonné } from '../../bus/evenements/retourOutilDonne.js';
import { estUnOutil } from '../../metier/outils/outils.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { schemaRetourUtilisateur } from '../retourUtilisateur.schema.js';
import { valideCorpsRequete } from '../zod.js';

import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceRetoursSurOutil = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/:idOutil',
    valideCorpsRequete(schemaRetourUtilisateur),
    filetRouteAsynchrone(
      async (requête: CorpsDeRequeteTypee<z.output<typeof schemaRetourUtilisateur>>, réponse: Response) => {
        const outil = requête.params.idOutil as string;

        if (!estUnOutil(outil)) return réponse.sendStatus(HttpStatusCode.NotFound);

        const retour = requête.body.retour;

        await busEvenements.publie(
          new RetourOutilDonné({
            retour,
            outil,
            ...(retour === 'NEGATIF' && { commentaire: requête.body.commentaire }),
          })
        );

        réponse.sendStatus(HttpStatusCode.Created);
      }
    )
  );
  return routeur;
};
