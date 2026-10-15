import { NextFunction, Request, Response, Router } from 'express';
import { OutilTéléchargé } from '../../bus/evenements/outilTelecharge.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceModeleAnnuaireDeCrise = ({
  adaptateurHachage,
  busEvenements,
  entrepotUtilisateur,
  fournisseurChemin,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requête: Request, réponse: Response, suite: NextFunction) => {
      const utilisateur = requête.utilisateur as Utilisateur;
      réponse
        .attachment('modele-annuaire-de-crise.xlsx')
        .sendFile(fournisseurChemin.back.modèleAnnuaireDeCrise(), async (erreur) => {
          if (erreur) suite(erreur); // sendFile ne rejette pas d'erreur, il faut la propager manuellement
          await busEvenements.publie(new OutilTéléchargé(utilisateur.email, 'Modèle_annuaire_crise'));
        });
    })
  );
  return routeur;
};
