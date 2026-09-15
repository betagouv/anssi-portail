import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { valideCorpsRequete } from '../../zod.js';
import { schemaPostRéponsesRéflexesCyber } from './ressourceReponsesReflexesCyber.schema.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { SimulationRéflexesCyberRéponseSoumise } from '../../../bus/evenements/simulationReflexesCyberReponseSoumise.js';
import z from 'zod';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export const ressourceRéponsesRéflexesCyber = ({ busEvenements }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    valideCorpsRequete(schemaPostRéponsesRéflexesCyber),
    filetRouteAsynchrone(
      async (request: CorpsDeRequeteTypee<z.output<typeof schemaPostRéponsesRéflexesCyber>>, reponse) => {
        await busEvenements.publie(new SimulationRéflexesCyberRéponseSoumise(request.body));
        return reponse.sendStatus(HttpStatusCode.Created);
      }
    )
  );
  return routeur;
};
