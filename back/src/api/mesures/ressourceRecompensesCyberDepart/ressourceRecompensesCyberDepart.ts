import { Router } from 'express';
import { filetRouteAsynchrone } from '../../middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { Utilisateur } from '../../../metier/utilisateur.js';

export const ressourceRécompensesCyberDépart = ({
  serviceRécompensesCyberDépart,
  entrepotUtilisateur,
  adaptateurHachage,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get(
    '/',
    middleware.verifieJWT,
    valideCorpsRequete(corpsVide),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    filetRouteAsynchrone(async (requete, reponse) => {
      const nomOrganisation = (await (requete.utilisateur as Utilisateur).organisation()).nom;
      // TODO: what to do when user has no organization?
      const banniere = await serviceRécompensesCyberDépart.genereBanniere({
        nomOrganisation,
      });

      return reponse.type('png').send(banniere);
    })
  );

  return routeur;
};
