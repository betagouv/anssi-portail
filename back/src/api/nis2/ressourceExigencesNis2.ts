import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { estReferentiel } from '../../metier/nis2/exigence';

export const ressourceExigencesNis2 = ({
  entrepotExigence,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get('/', async (requete, reponse) => {
    const source = parametreVersReferentiel(requete.query.source as string);
    const cible = parametreVersReferentiel(requete.query.cible as string);
    if (cible !== 'NIS2' && source !== 'NIS2') {
      return reponse.sendStatus(404);
    }
    const exigences = await entrepotExigence.parReferentiel(source, cible);
    reponse.send(exigences);
  });

  return routeur;
};

const parametreVersReferentiel = (param: string) => {
  const valeurParam = param?.toUpperCase() ?? '';
  return estReferentiel(valeurParam) ? valeurParam : 'NIS2';
};
