import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { z } from 'zod';
import { TestHameçonnageRéponseSoumise } from '../../../bus/evenements/testHameconnageReponseSoumise.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { valideCorpsRequete } from '../../zod.js';
import { schémaPostRéponsesHameçonnage } from './ressourceReponsesHameconnage.schema.js';

import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceRéponsesHameçonnage = ({
  busEvenements,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/',
    valideCorpsRequete(schémaPostRéponsesHameçonnage),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(
      async (requête: CorpsDeRequeteTypee<z.output<typeof schémaPostRéponsesHameçonnage>>, réponse) => {
        const { utilisateur } = requête;
        await busEvenements.publie(
          new TestHameçonnageRéponseSoumise({
            idCorrélation: requête.body.idCorrélation,
            idMail: requête.body.idMail,
            réponseCorrecte: requête.body.réponse === 'bonne',
            email: utilisateur?.email,
            codeRegion: await utilisateur?.codeRegion(),
            codeSecteur: await utilisateur?.codeSecteur(),
            codeTrancheEffectif: await utilisateur?.codeTrancheEffectif(),
          })
        );
        return réponse.sendStatus(HttpStatusCode.Created);
      }
    )
  );

  return routeur;
};
