import { createObjectCsvStringifier } from 'csv-writer';
import { Guide } from './recuperateurGuide';

export const transformeEnCsv = (guides: Guide[]): string => {
  const stringifier = createObjectCsvStringifier({
    header: [
      { id: 'titre', title: 'Titre' },
      { id: 'resume', title: 'Résumé' },
      { id: 'datePublication', title: 'Date de publication' },
      { id: 'dateMiseAJour', title: 'Date de mise à jour' },
      { id: 'description', title: 'Description' },
    ],
    alwaysQuote: true,
  });
  return stringifier.getHeaderString() + stringifier.stringifyRecords(guides);
};
