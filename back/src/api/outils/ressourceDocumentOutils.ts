import { Request, Response, Router } from 'express';
import { OutilTéléchargé } from '../../bus/evenements/outilTelecharge.js';
import { Outil } from '../../metier/outils/outils.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { FournisseurChemin } from '../fournisseurChemin.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceDocumentOutils = (
  { adaptateurHachage, entrepotUtilisateur, middleware, busEvenements }: ConfigurationServeur,
  outil: Extract<Outil, 'modele-suivi-des-arrivees.docx' | 'modele-suivi-de-changement-de-fonction.docx'>,
  cheminFichier: FournisseurChemin['back'][keyof FournisseurChemin['back']]
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
        .sendFile(cheminFichier());

      const utilisateur: Utilisateur = requête.utilisateur;

      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, outil));
    })
  );
  return routeur;
};
