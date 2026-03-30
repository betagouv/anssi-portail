import { Router } from 'express';
import { SimulationNis2Terminee } from '../../bus/evenements/simulationNis2Terminee';
import { CalculEligibilite } from '../../metier/nis2-simulateur/questionnaire/calculEligibilite';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { valideCorpsRequete } from '../zod';
import { schemaPostSimulateurNis2 } from './ressourceSimulateurNis2.schemas';

export const ressourceSimulateurNis2 = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/',
    valideCorpsRequete(schemaPostSimulateurNis2()),
    filetRouteAsynchrone(async (requete, reponse) => {
      const resultat = new CalculEligibilite().evalueEligibilite(requete.body)
      await busEvenements.publie(new SimulationNis2Terminee(resultat));

      reponse.sendStatus(201);
    })
  );

  return routeur;
};
