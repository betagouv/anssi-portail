import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { check } from 'express-validator';
import { RetourExperienceDonne } from '../bus/evenements/retourExperienceDonne';

export const ressourceRetoursExperience = ({
  messagerieInstantanee,
  middleware,
  busEvenements,
}: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.post(
    '/',
    [
      check('raison')
        .isIn(['pas-clair', 'pas-le-temps', 'pas-decisionnaire', 'autre'])
        .withMessage('La raison est invalide'),
      check('emailDeContact')
        .optional({ values: 'falsy' })
        .isEmail()
        .withMessage("L'email est invalide"),
    ],
    middleware.valide(),
    middleware.aseptise('precision'),
    async (requete: Request, reponse: Response) => {
      const { raison, emailDeContact, precision } = requete.body;
      await messagerieInstantanee.notifieUnRetourExperience({
        raison,
        emailDeContact,
        precision,
      });
      await busEvenements.publie(
        new RetourExperienceDonne({ raison, emailDeContact })
      );
      reponse.sendStatus(201);
    }
  );
  return routeur;
};
