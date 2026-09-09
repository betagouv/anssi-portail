import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { TestExpositionRéalisé } from '../../../bus/evenements/TestExpositionRealise.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

export const ressourceTestsExposition = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post('/', valideCorpsRequete(corpsVide), async (_requête, réponse) => {
    await busEvenements.publie(new TestExpositionRéalisé());
    réponse.sendStatus(HttpStatusCode.Created);
  });

  return routeur;
};
