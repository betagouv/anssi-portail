import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { check } from 'express-validator';
import { CompteCree } from '../bus/evenements/compteCree';
import { Utilisateur } from '../metier/utilisateur';

const ressourceUtilisateurs = ({
  busEvenements,
  entrepotUtilisateur,
  middleware,
  adaptateurRechercheEntreprise,
  adaptateurJWT,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    middleware.aseptise('telephone', 'domainesSpecialite.*', 'siretEntite'),
    [
      check('token').not().isEmpty().withMessage('Le token est invalide'),
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
        telephone,
        domainesSpecialite,
        siretEntite,
        cguAcceptees,
        infolettreAcceptee,
        token,
      } = requete.body;

      try {
        const { email, nom, prenom, siret } = adaptateurJWT.decode(token);

        const utilisateur = new Utilisateur(
          {
            email,
            prenom,
            nom,
            telephone,
            domainesSpecialite,
            siretEntite: siret ?? siretEntite,
            cguAcceptees,
            infolettreAcceptee,
          },
          adaptateurRechercheEntreprise
        );

        await entrepotUtilisateur.ajoute(utilisateur);

        await busEvenements.publie(
          new CompteCree({ email, prenom, nom, infoLettre: infolettreAcceptee })
        );

        reponse.sendStatus(201);
      } catch {
        reponse.status(400).send({ erreur: 'Le token est invalide' });
      }
    }
  );
  return routeur;
};

export { ressourceUtilisateurs };
