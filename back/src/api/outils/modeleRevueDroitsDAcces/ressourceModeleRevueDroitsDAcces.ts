import { Request, Response, Router } from 'express';
import { OutilTéléchargé } from '../../../bus/evenements/outilTelecharge.js';
import { Utilisateur } from '../../../metier/utilisateur.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

export const ressourceModèleRevueDroitsDAccès = ({
  adaptateurHachage,
  busEvenements,
  entrepotUtilisateur,
  middleware,
  serviceModèleRevueDroitsDAccès,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requête: Request, réponse: Response) => {
      const utilisateur: Utilisateur = requête.utilisateur;

      const contenuBinaire = await serviceModèleRevueDroitsDAccès.génèreModèle();

      réponse
        .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .attachment('modele-revue-droits-d-acces.xlsx')
        .send(contenuBinaire);

      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, 'modele-revue-droits-d-acces.xlsx'));
    })
  );
  return routeur;
};
