import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { schemaAbonnementInfolettre } from './ressourceAbonnementInfolettre.schema';
import { valideCorpsRequete } from './zod';

export const ressourceAbonnementInfolettre = ({ adaptateurEmail }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post('/', valideCorpsRequete(schemaAbonnementInfolettre), async (requete, reponse) => {
    await adaptateurEmail.inscrisAInfolettre(requete.body.email);
    reponse.sendStatus(201);
  });
  return routeur;
};
