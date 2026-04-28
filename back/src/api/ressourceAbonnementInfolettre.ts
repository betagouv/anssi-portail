import { Router } from 'express';
import z from 'zod';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { schemaAbonnementInfolettre } from './ressourceAbonnementInfolettre.schema';
import { valideCorpsRequete } from './zod';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceAbonnementInfolettre = ({ adaptateurEmail }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaAbonnementInfolettre),
    filetRouteAsynchrone(async (requete: CorpsDeRequeteTypee<z.infer<typeof schemaAbonnementInfolettre>>, reponse) => {
      await adaptateurEmail.inscrisAInfolettre(requete.body.email);
      reponse.sendStatus(201);
    })
  );
  return routeur;
};
