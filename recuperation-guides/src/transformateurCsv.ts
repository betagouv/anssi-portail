import { createObjectCsvStringifier } from 'csv-writer';
import { Guide } from './recuperateurGuide';

export const transformeEnCsv = (guides: Guide[]): string => {
  const stringifier = createObjectCsvStringifier({
    header: [
      { id: 'id', title: 'Identifiant' },
      { id: 'titre', title: 'Titre' },
      { id: 'resume', title: 'Résumé' },
      { id: 'datePublication', title: 'Date de publication' },
      { id: 'dateMiseAJour', title: 'Date de mise à jour' },
      { id: 'description', title: 'Description' },
      { id: 'image', title: 'Image' },
      { id: 'documents', title: 'Documents' },
    ],
    alwaysQuote: true,
  });
  return stringifier.getHeaderString() + stringifier.stringifyRecords(guides);
};
