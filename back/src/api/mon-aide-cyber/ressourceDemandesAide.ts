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
      try {
        const { emailAidant, entiteAidee } = requete.body;
        const { email, departement, raisonSociale } = entiteAidee;
        await adaptateurMonAideCyber.creeDemandeAide({
          ...(emailAidant && { emailAidant }),
          entiteAidee: {
            email,
            departement,
            raisonSociale,
          },
        });
        reponse.sendStatus(201);
      } catch (e: unknown | Error) {
        reponse.status(400).send({ erreur: (e as Error).message });
      }
    }
  );
  return routeur;
};

export { ressourceDemandesAide };
