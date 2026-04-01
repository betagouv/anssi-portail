import { Router } from 'express';
import { ConfigurationServeur } from '../../src/api/configurationServeur';
import { filetRouteAsynchrone } from './middleware';

export const ressourceSanteGuides = ({ serviceSanteGuides, entrepotGuide }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    filetRouteAsynchrone(async (_requete, reponse) => {
      reponse.send(await serviceSanteGuides.calculeSante(await entrepotGuide.tous()));
    })
  );
  return routeur;
};
