import { Request, Response, Router } from 'express';
import { OutilTéléchargé } from '../../bus/evenements/outilTelecharge.js';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceModeleAnnuaireDeCrise = ({
  adaptateurHachage,
  busEvenements,
  entrepotUtilisateur,
  middleware,
  serviceModeleAnnuaireDeCrise,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requête: Request, réponse: Response) => {
      const utilisateur = requête.utilisateur as Utilisateur;

      const contenuBinaire = await serviceModeleAnnuaireDeCrise.génèreModèle();

      réponse
        .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .attachment('modele-annuaire-de-crise.xlsx')
        .send(contenuBinaire);

      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, 'Modèle_annuaire_crise'));
    })
  );
  return routeur;
};
