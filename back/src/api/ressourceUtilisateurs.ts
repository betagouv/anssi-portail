import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { check } from 'express-validator';
import { CompteCree } from '../bus/evenements/compteCree';
import { Utilisateur } from '../metier/utilisateur';

const ressourceUtilisateurs = ({
  busEvenements,
  entrepotUtilisateur,
  middleware,
  adaptateurRechercheEntreprise
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    middleware.aseptise(
      'email',
      'prenom',
      'nom',
      'telephone',
      'domainesSpecialite.*',
      'siretEntite'
    ),
    [
      check('email').isEmail().withMessage("L'email est invalide"),
      check('prenom').not().isEmpty().withMessage('Le prénom est invalide'),
      check('nom').not().isEmpty().withMessage('Le nom est invalide'),
      check('telephone')
        .optional({ values: 'falsy' })
        .matches(/^0\d{9}$/)
        .withMessage('Le téléphone est invalide'),
      check('domainesSpecialite')
        .isArray({ min: 1 })
        .withMessage('Les domaines de spécialité sont invalides'),
      check('siretEntite')
        .matches(/^\d{14}$/)
        .withMessage('Le siret est invalide'),
      check('cguAcceptees')
        .isBoolean()
        .withMessage("L'acceptation des CGU est invalide"),
      check('infolettreAcceptee')
        .isBoolean()
        .withMessage("L'acceptation de l'infolettre est invalide"),
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

      const utilisateur = new Utilisateur({
        email,
        prenom,
        nom,
        telephone,
        domainesSpecialite,
        siretEntite,
        cguAcceptees,
        infolettreAcceptee,
      }, adaptateurRechercheEntreprise)

      await entrepotUtilisateur.ajoute(utilisateur);

      await busEvenements.publie(
        new CompteCree({ email, prenom, nom, infoLettre: infolettreAcceptee })
      );

      reponse.sendStatus(201);
    }
  );
  return routeur;
};

export { ressourceUtilisateurs };
