import { Router } from 'express';
import { valideCorpsRequete, corpsVide } from '../zod.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { Utilisateur } from '../../metier/utilisateur.js';

export const ressourceParcoursComplet = ({
  middleware,
  entrepôtModule,
  entrepotUtilisateur,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    async (requete, reponse) => {
      const utilisateur = requete.utilisateur as Utilisateur;
      const modules = await entrepôtModule.tous();
      const modulesParcoursComplet = modules
        .toSorted((a, b) => a.id - b.id)
        .map((module) => ({
          ...module,
          nombreMesuresTotal: module.nombreDeMesures(),
          cibleBadge: module.cibleDéblocageBadgeCyberdépart(),
          nombreMesuresPrisesEnCompte: utilisateur.nombreDeMesuresPrisesEnCompte(module),
        }));
      reponse.send({
        modules: modulesParcoursComplet,
      });
    }
  );

  return routeur;
};
