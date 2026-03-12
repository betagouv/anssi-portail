import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { versReferentiel } from '../../metier/nis2/exigence';

export const ressourceExigencesNis2 = ({
  adaptateurEnvironnement,
  entrepotExigence,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.get('/', async (requete, reponse) => {
    const { source, cible } = requete.query;
    if (
      (source && typeof source !== 'string') ||
      (cible && typeof cible !== 'string')
    ) {
      return reponse
        .status(400)
        .send('Les paramètres doivent être des chaînes de caractères');
    }

    const referentielSource = versReferentiel(source);
    const referentielCible = versReferentiel(cible);
    if (referentielCible !== 'NIS2' && referentielSource !== 'NIS2') {
      return reponse.sendStatus(404);
    }

    if (
      !adaptateurEnvironnement.fonctionnalites().nis2().afficheCyFun23() &&
      (referentielCible === 'CyFun23' || referentielSource === 'CyFun23')
    ) {
      return reponse.sendStatus(404);
    }

    const exigences = await entrepotExigence.parReferentiel(
      referentielSource,
      referentielCible
    );
    reponse.send(exigences);
  });

  return routeur;
};
