import { Request, Response, Router } from 'express';
import { check } from 'express-validator';
import { AvisUtilisateurDonne } from '../bus/evenements/avisUtilisateurDonne';
import { AvisUtilisateur } from '../metier/messagerieInstantanee';
import { ConfigurationServeur } from './configurationServeur';

export const ressourceAvisUtilisateur = ({
  busEvenements,
  messagerieInstantanee,
  middleware,
}: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.post(
    '/',
    [
      check('niveauDeSatisfaction')
        .isIn([1, 2, 3, 4, 5])
        .withMessage('Le niveau de satisfaction est invalide'),
      check('commentaire')
        .not()
        .isEmpty()
        .withMessage('Le commentaire est requis'),
      check('emailDeContact')
        .optional({ values: 'falsy' })
        .isEmail()
        .withMessage("L'email est invalide"),
    ],
    middleware.valide(),
    middleware.aseptise('commentaire'),
    async (requete: Request, reponse: Response) => {
      const { niveauDeSatisfaction, commentaire, emailDeContact } =
        requete.body as AvisUtilisateur;
      await messagerieInstantanee.notifieUnAvisUtilisateur({
        niveauDeSatisfaction,
        commentaire,
        emailDeContact,
      });
      await busEvenements.publie(
        new AvisUtilisateurDonne({ niveauDeSatisfaction, emailDeContact })
      );
      reponse.sendStatus(201);
    }
  );
  return routeur;
};
