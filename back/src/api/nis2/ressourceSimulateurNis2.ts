import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { SimulationNis2Terminee } from '../../bus/evenements/simulationNis2Terminee';

export const ressourceSimulateurNis2 = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post('/', async (requete, reponse) => {
    await busEvenements.publie(new SimulationNis2Terminee());
    reponse.status(201).json(requete.body);
  });

  return routeur;
};
