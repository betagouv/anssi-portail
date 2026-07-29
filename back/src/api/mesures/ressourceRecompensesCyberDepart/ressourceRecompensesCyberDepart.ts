import { Router } from 'express';
import { filetRouteAsynchrone } from '../../middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { Utilisateur } from '../../../metier/utilisateur.js';

export const ressourceRécompensesCyberDépart = ({
  serviceRécompensesCyberDépart,
  entrepotUtilisateur,
  entrepôtModule,
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
      const ID_MODULE_CYBERDEPART = 1;
      const moduleCyberdépart = await entrepôtModule.parId(ID_MODULE_CYBERDEPART);
      if (!moduleCyberdépart) {
        return reponse.sendStatus(500);
      }

      const cibleBadgeCyberdépart = moduleCyberdépart.cibleDéblocageBadgeCyberdépart()!;
      const utilisateur = requete.utilisateur as Utilisateur;
      if (utilisateur.nombreDeMesuresPrisesEnCompte(moduleCyberdépart) < cibleBadgeCyberdépart) {
        return reponse.sendStatus(403);
      }

      const nomOrganisation = (await (requete.utilisateur as Utilisateur).organisation()).nom;
      const banniere = await serviceRécompensesCyberDépart.genereBanniere({
        nomOrganisation,
      });

      return reponse.type('png').send(banniere);
    })
  );

  return routeur;
};
