import { createObjectCsvStringifier } from 'csv-writer';
import { Router } from 'express';
import { versReferentiel } from '../../metier/nis2/exigence';
import { ConfigurationServeur } from '../configurationServeur';
import { StrategieExportCsvUneLigneParExigence } from './strategieExportCsvUneLigneParExigence';

export const ressourceExigencesNis2Csv = ({
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

    const exigences = await entrepotExigence.parReferentiel(
      referentielSource,
      referentielCible
    );

    const strategieExportCsv = new StrategieExportCsvUneLigneParExigence();

    const stringifier = createObjectCsvStringifier({
      header: strategieExportCsv.entetes(),
      alwaysQuote: true,
      fieldDelimiter: ';',
    });

    const csv =
      stringifier.getHeaderString() +
      stringifier.stringifyRecords(strategieExportCsv.lignes(exigences));

    reponse.contentType('text/csv').send(csv);
  });

  return routeur;
};
