import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;
import { body, check } from 'express-validator';
import { codeDepartement } from '../../metier/referentielDepartements';

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
        const { emailAidant, identifiantAidant, entiteAidee, origine } =
          requete.body;
        const { email, departement, raisonSociale, siret } = entiteAidee;
        await adaptateurMonAideCyber.creeDemandeAide({
          ...(origine && { origine }),
          ...(emailAidant && { emailAidant }),
          ...(identifiantAidant && { identifiantAidant }),
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
