import { Router } from 'express';
import { SimulationNis2Terminee } from '../../bus/evenements/simulationNis2Terminee';
import { CalculEligibilite } from '../../metier/nis2-simulateur/questionnaire/calculEligibilite';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { valideCorpsRequete } from '../zod';
import { schemaPostSimulateurNis2 } from './ressourceSimulateurNis2.schemas';

export const ressourceSimulateurNis2 = ({ busEvenements, fournisseurChemin }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/',
    valideCorpsRequete(schemaPostSimulateurNis2()),
    filetRouteAsynchrone(async (requete, reponse) => {
      const cheminCsv = fournisseurChemin.cheminCsvNis2Simulateur();
      const resultat = new CalculEligibilite(cheminCsv).evalueEligibilite(requete.body);
      await busEvenements.publie(new SimulationNis2Terminee(resultat));

      reponse.sendStatus(201);
    })
  );

  return routeur;
};
