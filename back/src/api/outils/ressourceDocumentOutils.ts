import { Request, Response, Router } from 'express';
import { OutilTéléchargé } from '../../bus/evenements/outilTelecharge.js';
import { Outil } from '../../metier/outils/outils.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceDocumentOutils = (
  { adaptateurHachage, entrepotUtilisateur, middleware, busEvenements, fournisseurChemin }: ConfigurationServeur,
  outil: Extract<Outil, 'modele-suivi-des-arrivees.docx'>
) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requête: Request, réponse: Response) => {
      réponse
        .type('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        .attachment(outil)
        .sendFile(fournisseurChemin.back.modèleSuiviDesArrivées());

      const utilisateur: Utilisateur = requête.utilisateur;

      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, outil));
    })
  );
  return routeur;
};
