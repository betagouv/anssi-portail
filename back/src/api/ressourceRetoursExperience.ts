import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { check } from 'express-validator';

export const ressourceRetoursExperience = ({
  messagerieInstantanee,
  middleware,
}: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.post(
    '/',
    [
      check('raison')
        .isIn(['pas-clair', 'pas-le-temps', 'pas-besoin', 'autre'])
        .withMessage('La raison est invalide'),
      check('emailDeContact')
        .optional({ values: 'falsy' })
        .isEmail()
        .withMessage("L'email est invalide"),
    ],
    middleware.valide(),
    middleware.aseptise('precision'),
    (requete: Request, reponse: Response) => {
      messagerieInstantanee.notifieUnRetourExperience(requete.body);
      reponse.sendStatus(201);
    }
  );
  return routeur;
};
