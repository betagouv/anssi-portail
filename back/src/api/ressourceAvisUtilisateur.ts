import { Response, Router } from 'express';
import z from 'zod';
import { AvisUtilisateurDonne } from '../bus/evenements/avisUtilisateurDonne';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { schemaRessourceAvisUtilisateur } from './ressourceAvisUtilisateur.schema';
import { valideCorpsRequete } from './zod';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceAvisUtilisateur = ({ busEvenements, messagerieInstantanee }: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaRessourceAvisUtilisateur),
    filetRouteAsynchrone(
      async (requete: CorpsDeRequeteTypee<z.infer<typeof schemaRessourceAvisUtilisateur>>, reponse: Response) => {
        const { niveauDeSatisfaction, commentaire, emailDeContact } = requete.body;
        await messagerieInstantanee.notifieUnAvisUtilisateur({
          niveauDeSatisfaction,
          commentaire,
          emailDeContact,
        });
        await busEvenements.publie(new AvisUtilisateurDonne({ niveauDeSatisfaction, emailDeContact }));
        reponse.sendStatus(201);
      }
    )
  );
  return routeur;
};
