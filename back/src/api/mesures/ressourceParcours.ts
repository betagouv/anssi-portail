import { Router } from 'express';
import { Utilisateur } from '../../metier/utilisateur.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { valideCorpsRequete } from '../zod.js';
import { schemaRessourceParcours } from './ressourceParcours.schema.js';

export const ressourceParcours = ({ entrepotUtilisateur, adaptateurHachage, middleware }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.put(
    '',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(schemaRessourceParcours),
    async (requête, réponse) => {
      const utilisateur = requête.utilisateur as Utilisateur;
      utilisateur.rejoinsProgrammeAccompagnement(requête.body.nom);
      await entrepotUtilisateur.metsAJour(utilisateur);
      réponse.sendStatus(204);
    }
  );

  return routeur;
};
