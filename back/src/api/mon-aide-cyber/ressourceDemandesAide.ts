import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;
import { body, check } from 'express-validator';
import { codeDepartement } from '../../metier/referentielDepartements';

export type CorpsDemandeAide = {
  email: string;
  emailAidant?: string;
  entite: {
    departement: string;
    raisonSociale: string;
  };
  validationCGU: boolean;
};

const ressourceDemandesAide = ({
  adaptateurMonAideCyber,
  middleware,
}: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.post(
    '/',
    middleware.aseptise(
      'email',
      'emailAidant',
      'entite.departement',
      'entite.raisonSociale'
    ),
    check('entite.departement')
      .isString()
      .isIn(codeDepartement)
      .withMessage('Veuillez saisir un département valide.'),
    body('entite.raisonSociale')
      .isString()
      .notEmpty()
      .withMessage('Veuillez saisir une raison sociale valide.'),
    body('email')
      .notEmpty()
      .isEmail()
      .withMessage('Veuillez saisir un email valide.'),
    body('emailAidant')
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage('Veuillez saisir un email valide pour l’Aidant.'),
    body('validationCGU')
      .custom((validationCGU) => !!validationCGU)
      .withMessage('Veuillez valider les CGU.'),
    middleware.valide(),
    async (requete: CorpsDeRequeteTypee<CorpsDemandeAide>, reponse) => {
      await adaptateurMonAideCyber.creeDemandeAide({
        email: requete.body.email,
        ...(requete.body.emailAidant && {
          emailAidant: requete.body.emailAidant,
        }),
        departement: requete.body.entite.departement,
        raisonSociale: requete.body.entite.raisonSociale,
      });
      reponse.sendStatus(201);
    }
  );
  return routeur;
};

export { ressourceDemandesAide };
