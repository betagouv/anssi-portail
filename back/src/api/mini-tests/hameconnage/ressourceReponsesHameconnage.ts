import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { z } from 'zod';
import { TestHameçonnageRéponseSoumise } from '../../../bus/evenements/testHameconnageReponseSoumise.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { valideCorpsRequete } from '../../zod.js';
import { schémaPostRéponsesHameçonnage } from './ressourceReponsesHameconnage.schema.js';

import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceRéponsesHameçonnage = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/',
    valideCorpsRequete(schémaPostRéponsesHameçonnage),
    filetRouteAsynchrone(
      async (requête: CorpsDeRequeteTypee<z.output<typeof schémaPostRéponsesHameçonnage>>, réponse) => {
        await busEvenements.publie(
          new TestHameçonnageRéponseSoumise({
            idCorrélation: requête.body.idCorrélation,
            idMail: requête.body.idMail,
            réponseCorrecte: requête.body.réponse === 'bonne',
          })
        );
        return réponse.sendStatus(HttpStatusCode.Created);
      }
    )
  );

  return routeur;
};
