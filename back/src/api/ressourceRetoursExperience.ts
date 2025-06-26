import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

export const ressourceRetoursExperience = ({
  messagerieInstantanee,
}: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.post('/', (requete, reponse) => {
    messagerieInstantanee.notifieUnRetourExperience(requete.body);
    reponse.sendStatus(201);
  });
  return routeur;
};
