import { createObjectCsvStringifier } from 'csv-writer';
import { Router } from 'express';
import z from 'zod';
import { Referentiel, versLangueConnue, versReferentiel } from '../../metier/nis2/exigence';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { valideRequete } from '../zod';
import { schemaRessourceExigencesNis2, schemaRessourceExigencesNis2Query } from './ressourceExigencesNis2.schema';
import { StrategieExportCsvUneLigneParExigence } from './strategieExportCsvUneLigneParExigence';

export const ressourceExigencesNis2Csv = ({ entrepotExigence }: ConfigurationServeur) => {
  const routeur = Router();

  function nomFichierCsv(referentielSource: Referentiel, referentielCible: Referentiel, langue?: string) {
    const avecLangue = (nom: string) => {
      const langueConnue = versLangueConnue(langue);
      return `${nom}${langueConnue === 'FR' ? '' : '-' + langueConnue}`;
    };

    if (referentielCible === 'ISO') {
      return avecLangue('Comparaison_ReCyf-NIS2_ISO');
    } else if (referentielCible === 'AE') {
      return avecLangue('Comparaison_ReCyf-NIS2_Annexe_Reglement_execution_2024_2690');
    } else if (referentielCible === 'CyFun23') {
      return avecLangue('Comparaison_ReCyf-NIS2_CyFun23');
    } else if (referentielSource === 'ISO') {
      return avecLangue('Comparaison_ISO_ReCyf-NIS2');
    } else if (referentielSource === 'AE') {
      return avecLangue('Comparaison_Annexe_Reglement_execution_2024_2690_ReCyf-NIS2');
    } else if (referentielSource === 'CyFun23') {
      return avecLangue('Comparaison_CyFun23_ReCyf-NIS2');
    } else {
      return avecLangue('Liste_des_exigences_applicables_a_NIS2');
    }
  }

  routeur.get(
    '/',
    valideRequete(schemaRessourceExigencesNis2),
    filetRouteAsynchrone(async (requete, reponse) => {
      const { source, cible, langue } = requete.query.data as z.infer<typeof schemaRessourceExigencesNis2Query>;

      const referentielSource = versReferentiel(source);
      const referentielCible = versReferentiel(cible);
      if (referentielCible !== 'NIS2' && referentielSource !== 'NIS2') {
        return reponse.sendStatus(404);
      }

      const exigences = await entrepotExigence.parReferentiel(referentielSource, referentielCible);

      const strategieExportCsv = new StrategieExportCsvUneLigneParExigence();

      const stringifier = createObjectCsvStringifier({
        header: strategieExportCsv.entetes(exigences),
        alwaysQuote: true,
        fieldDelimiter: ';',
      });

      const langueConnue = versLangueConnue(langue as string);
      const csv = `\uFEFF${stringifier.getHeaderString()}${stringifier.stringifyRecords(strategieExportCsv.lignes(exigences, langueConnue))}`;

      reponse.attachment(nomFichierCsv(referentielSource, referentielCible, langue as string) + '.csv').send(csv);
    })
  );

  return routeur;
};
