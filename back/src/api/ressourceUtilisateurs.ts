import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourceUtilisateurs = ({
  entrepotUtilisateur,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    middleware.aseptise('email', 'prenom', 'nom', 'telephone', 'postes.*', 'siretEntite'),
    async (requete: Request, reponse: Response) => {
      const {
        email,
        prenom,
        nom,
        telephone,
        postes,
        siretEntite,
        cguAcceptees,
        infolettreAcceptee,
      } = requete.body;

      await entrepotUtilisateur.ajoute({
        email,
        prenom,
        nom,
        telephone,
        postes,
        siretEntite,
        cguAcceptees,
        infolettreAcceptee,
      });

      reponse.sendStatus(201);
    }
  );
  return routeur;
};

export { ressourceUtilisateurs };
