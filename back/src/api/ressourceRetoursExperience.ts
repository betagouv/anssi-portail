import { Response, Router } from 'express';
import z from 'zod';
import { RetourExperienceDonne } from '../bus/evenements/retourExperienceDonne';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { schemaRessourceRetoursExperience } from './ressourceRetoursExperience.schema';
import { valideCorpsRequete } from './zod';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceRetoursExperience = ({ messagerieInstantanee, busEvenements }: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaRessourceRetoursExperience),
    filetRouteAsynchrone(
      async (requete: CorpsDeRequeteTypee<z.infer<typeof schemaRessourceRetoursExperience>>, reponse: Response) => {
        const { raison, emailDeContact, precision } = requete.body;
        await messagerieInstantanee.notifieUnRetourExperience({
          raison,
          emailDeContact,
          precision,
        });
        await busEvenements.publie(new RetourExperienceDonne({ raison, emailDeContact }));
        reponse.sendStatus(201);
      }
    )
  );
  return routeur;
};
