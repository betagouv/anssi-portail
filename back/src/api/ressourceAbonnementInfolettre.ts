import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

export const ressourceAbonnementInfolettre = ({ adaptateurEmail }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post('/', async (requete, reponse) => {
    await adaptateurEmail.inscrisAInfolettre(requete.body.email);
    reponse.sendStatus(201);
  });
  return routeur;
};
