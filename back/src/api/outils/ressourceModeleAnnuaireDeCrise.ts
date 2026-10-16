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
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requête: Request, réponse: Response) => {
      const utilisateur: Utilisateur = requête.utilisateur;
      const { codeActivite } = await utilisateur.organisation();
      const codeRégion = await utilisateur.codeRegion();

      const contenuBinaire = await serviceModeleAnnuaireDeCrise.génèreModèle({
        codeActivité: codeActivite,
        codeRégion,
      });

      réponse
        .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .attachment('modele-annuaire-de-crise.xlsx')
        .send(contenuBinaire);

      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, 'Modèle_annuaire_crise'));
    })
  );
  return routeur;
};
