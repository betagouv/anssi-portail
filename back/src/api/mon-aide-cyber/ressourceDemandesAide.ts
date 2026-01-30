import cors from 'cors';
import { Router } from 'express';
import { body, check } from 'express-validator';
import { codeDepartement } from '../../metier/referentielDepartements';
import { ConfigurationServeur } from '../configurationServeur';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export type CorpsDemandeAide = {
  origine?: string;
  entiteAidee: {
    email: string;
    departement: string;
    raisonSociale: string;
    siret: string;
  };
  emailAidant?: string;
  identifiantAidant?: string;
  siretAidant?: string;
  validationCGU: boolean;
};

const ressourceDemandesAide = ({
  adaptateurMonAideCyber,
  middleware,
}: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.options('/', cors());
  routeur.post(
    '/',
    cors(),
    middleware.aseptise(
      'entiteAidee.email',
      'entiteAidee.departement',
      'entiteAidee.raisonSociale',
      'emailAidant',
      'identifiantAidant'
    ),
    check('entiteAidee.departement')
      .isString()
      .isIn(codeDepartement)
      .withMessage('Veuillez saisir un département valide.'),
    check('entiteAidee.siret')
      .matches(/^\d{14}$/)
      .withMessage('Veuillez saisir un SIRET valide.'),
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
      .withMessage('Veuillez saisir un email valide pour l’Aidant cyber.'),
    body('identifiantAidant')
      .optional({ values: 'falsy' })
      .trim()
      .isUUID()
      .withMessage('Veuillez saisir un identifiant Aidant cyber valide.'),
    body('siretAidant')
      .optional()
      .matches(/^\d{14}$/)
      .withMessage('Veuillez saisir un SIRET Aidant cyber valide.'),
    body('origine')
      .optional({ checkFalsy: true })
      .custom((origine) => origine && origine.trim().length > 0)
      .withMessage('Veuillez saisir une origine valide.'),
    body('validationCGU')
      .custom((validationCGU) => !!validationCGU)
      .withMessage('Veuillez valider les CGU.'),
    middleware.valide(),
    async (requete: CorpsDeRequeteTypee<CorpsDemandeAide>, reponse) => {
      try {
        const {
          emailAidant,
          identifiantAidant,
          siretAidant,
          entiteAidee,
          origine,
        } = requete.body;
        const { email, departement, raisonSociale, siret } = entiteAidee;
        await adaptateurMonAideCyber.creeDemandeAide({
          ...(origine && { origine }),
          aidant: {
            ...(emailAidant && { email: emailAidant }),
            ...(identifiantAidant && { identifiant: identifiantAidant }),
            ...(siretAidant && { siret: siretAidant }),
          },
          entiteAidee: {
            email,
            departement,
            raisonSociale,
            siret,
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
