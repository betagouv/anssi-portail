import { createObjectCsvStringifier } from 'csv-writer';
import { Router } from 'express';
import { Referentiel, versReferentiel } from '../../metier/nis2/exigence';
import { ConfigurationServeur } from '../configurationServeur';
import { StrategieExportCsvUneLigneParExigence } from './strategieExportCsvUneLigneParExigence';

export const ressourceExigencesNis2Csv = ({
  entrepotExigence,
}: ConfigurationServeur) => {
  const routeur = Router();

  function nomFichierCsv(
    referentielSource: Referentiel,
    referentielCible: Referentiel
  ) {
    if (referentielCible === 'ISO') {
      return 'Comparaison_ReCyf-NIS2_ISO';
    } else if (referentielCible === 'AE') {
      return 'Comparaison_ReCyf-NIS2_Annexe_Reglement_execution_2024_2690';
    } else if (referentielSource === 'ISO') {
      return 'Comparaison_ISO_ReCyf-NIS2';
    } else if (referentielSource === 'AE') {
      return 'Comparaison_Annexe_Reglement_execution_2024_2690_ReCyf-NIS2';
    } else {
      return 'Liste_des_exigences_applicables_a_NIS2';
    }
  }

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
      header: strategieExportCsv.entetes(exigences),
      alwaysQuote: true,
      fieldDelimiter: ';',
    });

    const csv =
      stringifier.getHeaderString() +
      stringifier.stringifyRecords(strategieExportCsv.lignes(exigences));

    reponse
      .attachment(nomFichierCsv(referentielSource, referentielCible) + '.csv')
      .send(csv);
  });

  return routeur;
};
