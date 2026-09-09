import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { TestExpositionRéalisé } from '../../../bus/evenements/TestExpositionRealise.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { valideCorpsRequete } from '../../zod.js';
import { schemaPostTestExposition } from './ressourceTestsExposition.schema.js';

export const ressourceTestsExposition = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post('/', valideCorpsRequete(schemaPostTestExposition), async (requête, réponse) => {
    const { typeOrganisation, secteur, facteursAggravant } = requête.body;

    await busEvenements.publie(new TestExpositionRéalisé(typeOrganisation, secteur, facteursAggravant));
    réponse.sendStatus(HttpStatusCode.Created);
  });

  return routeur;
};
