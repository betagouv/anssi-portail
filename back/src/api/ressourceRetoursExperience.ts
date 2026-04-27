import { Request, Response, Router } from 'express';
import { RetourExperienceDonne } from '../bus/evenements/retourExperienceDonne';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { schemaRessourceRetoursExperience } from './ressourceRetoursExperience.schema';
import { valideCorpsRequete } from './zod';

export const ressourceRetoursExperience = ({ messagerieInstantanee, busEvenements }: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaRessourceRetoursExperience),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const { raison, emailDeContact, precision } = requete.body;
      await messagerieInstantanee.notifieUnRetourExperience({
        raison,
        emailDeContact,
        precision,
      });
      await busEvenements.publie(new RetourExperienceDonne({ raison, emailDeContact }));
      reponse.sendStatus(201);
    })
  );
  return routeur;
};
