import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { SimulationNis2Terminee } from '../../bus/evenements/simulationNis2Terminee';
import { valideBody } from '../zod';
import { schemaPostSimulateurNis2 } from './ressourceSimulateurNis2.schemas';

export const ressourceSimulateurNis2 = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post('/', valideBody(schemaPostSimulateurNis2()), async (requete, reponse) => {
    await busEvenements.publie(new SimulationNis2Terminee(requete.body));

    reponse.sendStatus(201);
  });

  return routeur;
};
