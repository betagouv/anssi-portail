import { Router } from 'express';
import { ConfigurationServeur } from '../../src/api/configurationServeur.js';
import { filetRouteAsynchrone } from './middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

export const ressourceSanteGuides = ({ serviceSanteGuides, entrepotGuide }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete, reponse) => {
      reponse.send(await serviceSanteGuides.calculeSante(await entrepotGuide.tous()));
    })
  );
  return routeur;
};
