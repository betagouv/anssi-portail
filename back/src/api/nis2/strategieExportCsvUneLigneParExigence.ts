import { Exigence, ExigenceNIS2 } from '../../metier/nis2/exigence';

export class StrategieExportCsvUneLigneParExigence {
  entetes = (exigences: Exigence[]) => {
    if ((exigences[0] as ExigenceNIS2).correspondances.ISO) {
      const resultat = [
        { id: 'reference', title: 'Référence' },
        { id: 'contenu', title: 'Contenu' },
        { id: 'objectif', title: 'Objectif' },
        { id: 'thematique', title: 'Thématique' },
        { id: 'cibles', title: 'Cibles' },
        { id: 'correspondance', title: 'Correspondance' },
      ];

      const nombreCorrespondanceMax = Math.max(
        ...exigences.map(
          (e) => (e as ExigenceNIS2).correspondances.ISO?.exigences.length ?? 0
        )
      );

      for (let i = 1; i < nombreCorrespondanceMax + 1; i++) {
        resultat.push({
          id: `reference_iso_${i}`,
          title: `Référence ISO (${i})`,
        });
        resultat.push({
          id: `contenu_iso_${i}`,
          title: `Contenu ISO (${i})`,
        });
      }
      return resultat;
    } else {
      return [
        { id: 'reference', title: 'Référence' },
        { id: 'contenu', title: 'Contenu' },
        { id: 'objectif', title: 'Objectif' },
        { id: 'thematique', title: 'Thématique' },
        { id: 'cibles', title: 'Cibles' },
      ];
    }
  };

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
