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
    exigences.map((exigence) => {
      const exigenceNIS2 = exigence as ExigenceNIS2;
      return {
        reference: exigenceNIS2.reference,
        contenu: exigenceNIS2.contenu,
        objectif: exigenceNIS2.objectifSecurite,
        thematique: exigenceNIS2.thematique,
        cibles: exigenceNIS2.entitesCible.join(', '),
      };
    });
}
