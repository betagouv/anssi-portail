import { Router } from 'express';
import { ConfigurationServeur } from '../../src/api/configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { corpsVide, valideCorpsRequete } from './zod';

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
