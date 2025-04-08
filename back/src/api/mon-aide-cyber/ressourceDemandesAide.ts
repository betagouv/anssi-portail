import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;
import { body, check } from 'express-validator';
import { codeDepartement } from '../../metier/referentielDepartements';

export type CorpsDemandeAide = {
  entiteAidee: {
    email: string;
    departement: string;
    raisonSociale: string;
  };
  emailAidant?: string;
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
      'entiteAidee.email',
      'entiteAidee.departement',
      'entiteAidee.raisonSociale',
      'emailAidant'
    ),
    check('entiteAidee.departement')
      .isString()
      .isIn(codeDepartement)
      .withMessage('Veuillez saisir un département valide.'),
    body('entiteAidee.raisonSociale')
      .isString()
      .notEmpty()
      .withMessage('Veuillez saisir une raison sociale valide.'),
    body('entiteAidee.email')
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
      const { emailAidant, entiteAidee, validationCGU } = requete.body;
      const { email, departement, raisonSociale } = entiteAidee;
      await adaptateurMonAideCyber.creeDemandeAide({
        ...(emailAidant && { emailAidant }),
        entiteAidee: {
          email,
          departement,
          raisonSociale,
        },
          validationCGU
      });
      reponse.sendStatus(201);
    }
  );
  return routeur;
};

export { ressourceDemandesAide };
