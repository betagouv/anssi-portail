import { Request, Response, Router } from 'express';

import { HttpStatusCode } from '@anssi-portail/axios';

import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

export const ressourcePageAccueil = ({
  entrepotUtilisateur,
  middleware,
  adaptateurHachage,
  fournisseurChemin,
  adaptateurEnvironnement,
}: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requête: Request, réponse: Response) => {
      if (adaptateurEnvironnement.fonctionnalites.espaceConnecté() && requête.utilisateur) {
        return réponse.redirect('/tableau-de-bord');
      }

      await réponse
        .contentType('text/html')
        .status(HttpStatusCode.Ok)
        .envoieFichierEnrichi(fournisseurChemin.jekyll.page(''));
    })
  );
  return routeur;
};
