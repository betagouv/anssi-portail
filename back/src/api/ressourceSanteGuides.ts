import { Router } from 'express';
import { ConfigurationServeur } from '../../src/api/configurationServeur';

export const ressourceSanteGuides = ({
  serviceSanteGuides,
  entrepotGuide,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (_requete, reponse) => {
    reponse.send(serviceSanteGuides.calculeSante(await entrepotGuide.tous()));
  });
  return routeur;
};
