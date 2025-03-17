import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { check } from 'express-validator';
import { codesDomainesDeSpecialite } from '../metier/referentielDomainesDeSpecialite';

const ressourceUtilisateurs = ({
  entrepotUtilisateur,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    middleware.aseptise('email', 'prenom', 'nom', 'telephone', 'domainesSpecialite.*', 'siretEntite'),
    [
      check('email').isEmail().withMessage("L'email est invalide"),
      check('prenom').not().isEmpty().withMessage("Le prénom est invalide"),
      check('nom').not().isEmpty().withMessage("Le nom est invalide"),
      check('telephone').optional({values: 'falsy'}).matches(/^0\d{9}$/).withMessage("Le téléphone est invalide"),
      check('domainesSpecialite').isArray({min: 1}).isIn(codesDomainesDeSpecialite).withMessage("Les domaines de spécialité sont invalides"),
      check('siretEntite').matches(/^\d{14}$/).withMessage("Le siret est invalide"),
      check('cguAcceptees').isBoolean().withMessage("L'acceptation des CGU est invalide"),
      check('infolettreAcceptee').isBoolean().withMessage("L'acceptation de l'infolettre est invalide"),
    ],
    middleware.valide(),
    async (requete: Request, reponse: Response) => {
      const {
        email,
        prenom,
        nom,
        telephone,
        domainesSpecialite,
        siretEntite,
        cguAcceptees,
        infolettreAcceptee,
      } = requete.body;

      await entrepotUtilisateur.ajoute({
        email,
        prenom,
        nom,
        telephone,
        domainesSpecialite,
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
