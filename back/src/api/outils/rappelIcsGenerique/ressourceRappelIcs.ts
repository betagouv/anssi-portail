import { Request, Response, Router } from 'express';

import { Outil } from '@metier/outils/outils.js';
import { RappelAnnuel } from '@metier/outils/rappelAnnuel.js';
import { Utilisateur } from '@metier/utilisateur.js';
import { OutilTéléchargé } from '@bus/evenements/outilTelecharge.js';

import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';
import { génèreRappelIcs } from './genereRappelIcs.js';

export const ressourceRappelIcsGénérique = (
  { adaptateurHachage, adaptateurHorloge, busEvenements, entrepotUtilisateur, middleware }: ConfigurationServeur,
  rappel: RappelAnnuel,
  outil: Outil
) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requête: Request, réponse: Response) => {
      const utilisateur = requête.utilisateur as Utilisateur;

      const contenu = await génèreRappelIcs(rappel, adaptateurHorloge);

      réponse.attachment(outil);
      réponse.contentType('text/calendar');
      réponse.send(contenu);
      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, outil));
    })
  );

  return routeur;
};
