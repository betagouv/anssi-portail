import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { SimulationNis2Terminee } from '../../bus/evenements/simulationNis2Terminee';

export const ressourceSimulateurNis2 = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post('/', async (_requete, reponse) => {
    await busEvenements.publie(new SimulationNis2Terminee());
    reponse.sendStatus(201);
  });

  return routeur;
};
