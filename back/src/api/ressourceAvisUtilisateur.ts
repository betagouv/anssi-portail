import { Request, Response, Router } from 'express';
import { AvisUtilisateurDonne } from '../bus/evenements/avisUtilisateurDonne';
import { AvisUtilisateur } from '../metier/messagerieInstantanee';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { schemaRessourceAvisUtilisateur } from './ressourceAvisUtilisateur.schema';
import { valideCorpsRequete } from './zod';

export const ressourceAvisUtilisateur = ({ busEvenements, messagerieInstantanee }: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaRessourceAvisUtilisateur),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const { niveauDeSatisfaction, commentaire, emailDeContact } = requete.body as AvisUtilisateur;
      await messagerieInstantanee.notifieUnAvisUtilisateur({
        niveauDeSatisfaction,
        commentaire,
        emailDeContact,
      });
      await busEvenements.publie(new AvisUtilisateurDonne({ niveauDeSatisfaction, emailDeContact }));
      reponse.sendStatus(201);
    })
  );
  return routeur;
};
