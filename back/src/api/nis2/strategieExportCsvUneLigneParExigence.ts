import { Exigence, ExigenceNIS2 } from '../../metier/nis2/exigence';

class ConvertisseurCsvExigenceNIS2 {
  entetes(_exigences: Exigence[]) {
    return [
      { id: 'reference', title: 'Référence' },
      { id: 'contenu', title: 'Contenu' },
      { id: 'objectif', title: 'Objectif' },
      { id: 'thematique', title: 'Thématique' },
      { id: 'cibles', title: 'Cibles' },
    ];
  }

  enLigne(exigence: ExigenceNIS2) {
    return {
      reference: exigence.reference,
      contenu: exigence.contenu,
      objectif: exigence.objectifSecurite,
      thematique: exigence.thematique,
      cibles: exigence.entitesCible.join(', '),
    };
  }
}

class ConvertisseurCsvExigenceNIS2AvecCorrespondances extends ConvertisseurCsvExigenceNIS2 {
  entetes(exigences: Exigence[]) {
    const resultat = [
      ...super.entetes(exigences),
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
      resultat.push({ id: `contenu_iso_${i}`, title: `Contenu ISO (${i})` });
    }
    return resultat;
  }

  enLigne(exigenceNIS2: ExigenceNIS2) {
    const exigencesISO = exigenceNIS2.correspondances.ISO!.exigences.reduce(
      (previousValue, currentValue, currentIndex) => {
        return {
          ...previousValue,
          [`reference_iso_${currentIndex + 1}`]: currentValue.reference,
          [`contenu_iso_${currentIndex + 1}`]: currentValue.contenu,
        };
      },
      {}
    );
    return {
      ...super.enLigne(exigenceNIS2),
      correspondance: exigenceNIS2.correspondances.ISO!.niveau,
      ...exigencesISO,
    };
  }
}

class ConvertisseurCsvExigenceNIS2AvecCorrespondancesAE extends ConvertisseurCsvExigenceNIS2 {
  entetes(exigences: Exigence[]) {
    const resultat = [
      ...super.entetes(exigences),
      { id: 'correspondance', title: 'Correspondance' },
    ];
    const nombreCorrespondanceMax = Math.max(
      ...exigences.map(
        (e) => (e as ExigenceNIS2).correspondances.AE?.exigences.length ?? 0
      )
    );

    for (let i = 1; i < nombreCorrespondanceMax + 1; i++) {
      resultat.push({
        id: `reference_ae_${i}`,
        title: `Référence AE (${i})`,
      });
      resultat.push({ id: `contenu_ae_${i}`, title: `Contenu AE (${i})` });
    }
    return resultat;
  }

  enLigne(exigenceNIS2: ExigenceNIS2) {
    const exigencesAE = exigenceNIS2.correspondances.AE!.exigences.reduce(
      (previousValue, currentValue, currentIndex) => {
        return {
          ...previousValue,
          [`reference_ae_${currentIndex + 1}`]: currentValue.reference,
          [`contenu_ae_${currentIndex + 1}`]: currentValue.contenu,
        };
      },
      {}
    );
    return {
      ...super.enLigne(exigenceNIS2),
      correspondance: exigenceNIS2.correspondances.AE!.niveau,
      ...exigencesAE,
    };
  }
}

export class StrategieExportCsvUneLigneParExigence {
  entetes = (exigences: Exigence[]) => {
    const convertisseurCsv = this.convertisseurCsv(exigences[0]);
    return convertisseurCsv.entetes(exigences);
  };

  lignes = (exigences: Exigence[]) =>
    exigences.map((exigence) => {
      const convertisseurCsv = this.convertisseurCsv(exigence);
      return convertisseurCsv.enLigne(exigence as ExigenceNIS2);
    });

  private convertisseurCsv(exigence: Exigence): ConvertisseurCsvExigenceNIS2 {
    if ((exigence as ExigenceNIS2).correspondances.ISO) {
      return new ConvertisseurCsvExigenceNIS2AvecCorrespondances();
    } else if ((exigence as ExigenceNIS2).correspondances.AE) {
      return new ConvertisseurCsvExigenceNIS2AvecCorrespondancesAE();
    } else {
      return new ConvertisseurCsvExigenceNIS2();
    }
  }
}
