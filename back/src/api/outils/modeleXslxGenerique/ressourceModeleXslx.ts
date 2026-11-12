import { Request, Response, Router } from 'express';
import { OutilTéléchargé } from '../../../bus/evenements/outilTelecharge.js';
import { Outil } from '../../../metier/outils/outils.js';
import { Utilisateur } from '../../../metier/utilisateur.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';
import { ServiceModèleXslx } from './serviceModeleXslx.js';

export const ressourceModèleXslxGénérique = (
  { adaptateurHachage, busEvenements, entrepotUtilisateur, middleware }: ConfigurationServeur,
  serviceModèleXslx: ServiceModèleXslx,
  outil: Outil
) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requête: Request, réponse: Response) => {
      const utilisateur: Utilisateur = requête.utilisateur;

      const contenuBinaire = await serviceModèleXslx.génèreModèle();

      réponse
        .type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .attachment(outil)
        .send(contenuBinaire);

      await busEvenements.publie(new OutilTéléchargé(utilisateur.email, outil));
    })
  );
  return routeur;
};
