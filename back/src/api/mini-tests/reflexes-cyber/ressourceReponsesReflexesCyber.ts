import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import z from 'zod';
import { RéflexesCyber } from '../../../metier/mini-tests/reflexes-cyber/reflexesCyber.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { valideCorpsRequete } from '../../zod.js';
import { schemaPostRéponsesRéflexesCyber } from './ressourceReponsesReflexesCyber.schema.js';

import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceRéponsesRéflexesCyber = ({
  busEvenements,
  middleware,
  adaptateurHachage,
  entrepotUtilisateur,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaPostRéponsesRéflexesCyber),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(
      async (requête: CorpsDeRequeteTypee<z.output<typeof schemaPostRéponsesRéflexesCyber>>, reponse) => {
        const simulation = new RéflexesCyber();
        await simulation.consommeLaRéponse({
          busÉvénements: busEvenements,
          idCorrélation: requête.body.idCorrélation,
          idScénario: requête.body.idScénario,
          idRôle: requête.body.idRôle,
          numéroÉvènement: requête.body.numéroÉvènement,
          réflexe: requête.body.réflexe,
          utilisateur: requête.utilisateur,
        });
        return reponse.sendStatus(HttpStatusCode.Created);
      }
    )
  );
  return routeur;
};
