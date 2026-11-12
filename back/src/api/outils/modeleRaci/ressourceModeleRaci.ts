import { Request, Response, Router } from 'express';
import { OutilTéléchargé } from '../../../bus/evenements/outilTelecharge.js';
import { Utilisateur } from '../../../metier/utilisateur.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

export const ressourceModèleRaci = ({
  adaptateurHachage,
  busEvenements,
  entrepotUtilisateur,
  middleware,
  serviceModèleRACI,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requête: Request, réponse: Response) => {
      const utilisateur: Utilisateur = requête.utilisateur;

      const contenuBinaire = await serviceModèleRACI.génèreModèle();

      réponse
        .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .attachment('modele-raci.xlsx')
        .send(contenuBinaire);

      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, 'modele-raci.xlsx'));
    })
  );
  return routeur;
};
