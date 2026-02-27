import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { estReferentiel } from '../../metier/nis2/exigence';

export const ressourceExigencesNis2 = ({
  entrepotExigence,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get('/', async (requete, reponse) => {
    const valeurSource = requete.query.source as string;
    const source = estReferentiel(valeurSource) ? valeurSource : 'NIS2';
    const exigences = await entrepotExigence.parReferentiel(source);
    reponse.send(exigences);
  });

  return routeur;
};
