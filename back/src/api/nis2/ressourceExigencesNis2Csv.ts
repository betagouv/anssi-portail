import { createObjectCsvStringifier } from 'csv-writer';
import { Router } from 'express';
import { versReferentiel } from '../../metier/nis2/exigence';
import { ConfigurationServeur } from '../configurationServeur';

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

    const stringifier = createObjectCsvStringifier({
      header: [
        { id: 'reference', title: 'Référence' },
        { id: 'contenu', title: 'Contenu' },
        { id: 'objectif', title: 'Objectif' },
        { id: 'thematique', title: 'Thématique' },
        { id: 'cibles', title: 'Cibles' },
        { id: 'correspondance', title: 'Correspondance' },
        { id: 'reference_iso_1', title: 'Référence ISO (1)' },
        { id: 'contenu_iso_1', title: 'Contenu ISO (1)' },
        { id: 'reference_iso_2', title: 'Référence ISO (2)' },
        { id: 'contenu_iso_2', title: 'Contenu ISO (2)' },
      ],
      alwaysQuote: true,
      fieldDelimiter: ';',
    });

    const lignes = exigences.map((exigence) => ({
      reference: exigence.reference,
      contenu: exigence.contenu,
      objectif: 'Obj 1 : recensement',
      thematique: 'Recensement des SI',
      cibles: 'EntiteEssentielle, EntiteImportante',
      correspondance: 'faible',
      reference_iso_1: 'reference_1',
      contenu_iso_1: 'contenu 1',
      reference_iso_2: 'reference_2',
      contenu_iso_2: 'contenu 2',
    }));

    const csv =
      stringifier.getHeaderString() + stringifier.stringifyRecords(lignes);

    reponse.contentType('text/csv').send(csv);
  });

  return routeur;
};
