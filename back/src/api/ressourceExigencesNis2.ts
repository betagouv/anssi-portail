import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

export const ressourceExigencesNis2 = ({
  entrepotExigence,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', async (_requete, reponse) => {
    const exigences = await entrepotExigence.parReferentiel('nis2');
    reponse.send(exigences);
  });
  return routeur;
};
