import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { z } from 'zod';
import { TestHameçonnageRéponseSoumise } from '../../../bus/evenements/testHameconnageReponseSoumise.js';
import { TestHameçonnageTerminé } from '../../../bus/evenements/testHameconnageTermine.js';
import { Utilisateur } from '../../../metier/utilisateur.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { valideCorpsRequete } from '../../zod.js';
import { NOMBRE_DE_MAILS_HAMEÇONNAGE, schémaPostRéponsesHameçonnage } from './ressourceReponsesHameconnage.schema.js';

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
        const utilisateur = requête.utilisateur as Utilisateur | undefined;
        const informationsUtilisateur = {
          email: utilisateur?.email,
          codeRegion: await utilisateur?.codeRegion(),
          codeSecteur: await utilisateur?.codeSecteur(),
          codeTrancheEffectif: await utilisateur?.codeTrancheEffectif(),
        };
        await busEvenements.publie(
          new TestHameçonnageRéponseSoumise({
            idCorrélation: requête.body.idCorrélation,
            idMail: requête.body.idMail,
            réponseCorrecte: requête.body.réponse === 'bonne',
            ...informationsUtilisateur,
          })
        );
        if (requête.body.numéroRéponse === NOMBRE_DE_MAILS_HAMEÇONNAGE) {
          await busEvenements.publie(
            new TestHameçonnageTerminé({ idCorrélation: requête.body.idCorrélation, ...informationsUtilisateur })
          );
        }
        return réponse.sendStatus(HttpStatusCode.Created);
      }
    )
  );

  return routeur;
};
