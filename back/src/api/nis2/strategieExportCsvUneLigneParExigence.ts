import { Exigence } from '../../metier/nis2/exigence';

export class StrategieExportCsvUneLigneParExigence {
  entetes = () => [
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
  ];

  lignes = (exigences: Exigence[]) =>
    exigences.map((exigence) => ({
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
}
