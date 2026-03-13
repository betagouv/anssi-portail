import { Exigence, ExigenceAE, ExigenceNIS2 } from '../../metier/nis2/exigence';

class ConvertisseurCsvExigence<T extends Exigence> {
  entetes(_exigences: T[]): { id: string; title: string }[] {
    return [
      { id: 'reference', title: 'Référence' },
      { id: 'contenu', title: 'Contenu' },
    ];
  }
  enLigne(exigence: T): Record<string, string> {
    return {
      reference: exigence.reference,
      contenu: exigence.contenu,
    };
  }
}

class ConvertisseurCsvExigenceNIS2 extends ConvertisseurCsvExigence<ExigenceNIS2> {
  entetes(exigences: ExigenceNIS2[]) {
    return [
      ...super.entetes(exigences),
      { id: 'objectif', title: 'Objectif' },
      { id: 'thematique', title: 'Thématique' },
      { id: 'cibles', title: 'Cibles' },
    ];
  }

  enLigne(exigence: ExigenceNIS2): Record<string, string> {
    return {
      ...super.enLigne(exigence),
      objectif: exigence.objectifSecurite,
      thematique: exigence.thematique,
      cibles: exigence.entitesCible.join(', '),
    };
  }
}

class ConvertisseurCsvExigenceNIS2AvecCorrespondances extends ConvertisseurCsvExigenceNIS2 {
  entetes(exigences: ExigenceNIS2[]) {
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
  entetes(exigences: ExigenceNIS2[]) {
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

class ConvertisseurCsvExigenceAE extends ConvertisseurCsvExigence<ExigenceAE> {
  entetes(exigences: ExigenceAE[]) {
    const resultat = [
      ...super.entetes(exigences),
      { id: 'correspondance', title: 'Correspondance' },
    ];

    const nombreCorrespondanceMax = Math.max(
      ...exigences.map(
        (e) => (e as ExigenceAE).correspondances.NIS2.exigences.length ?? 0
      )
    );

    for (let i = 1; i < nombreCorrespondanceMax + 1; i++) {
      resultat.push({
        id: `reference_nis2_${i}`,
        title: `Référence NIS2 (${i})`,
      });
      resultat.push({ id: `contenu_nis2_${i}`, title: `Contenu NIS2 (${i})` });
    }
    return resultat;
  }

  enLigne(exigence: ExigenceAE) {
    const exigencesNIS2 = exigence.correspondances.NIS2!.exigences.reduce(
      (previousValue, currentValue, currentIndex) => {
        return {
          ...previousValue,
          [`reference_nis2_${currentIndex + 1}`]: currentValue.reference,
          [`contenu_nis2_${currentIndex + 1}`]: currentValue.contenu,
        };
      },
      {}
    );
    return {
      ...super.enLigne(exigence),
      correspondance: exigence.correspondances.NIS2!.niveau,
      ...exigencesNIS2,
    };
  }
}

export class StrategieExportCsvUneLigneParExigence {
  entetes = (exigences: Exigence[]) => {
    if (exigences.length === 0) return [];
    const convertisseurCsv = this.convertisseurCsv(exigences[0]);
    return convertisseurCsv.entetes(exigences);
  };

  lignes = (exigences: Exigence[]) =>
    exigences.map((exigence) => {
      const convertisseurCsv = this.convertisseurCsv(exigence);
      return convertisseurCsv.enLigne(exigence);
    });

  private convertisseurCsv(
    exigence: Exigence
  ): ConvertisseurCsvExigence<Exigence> {
    if ((exigence as ExigenceNIS2).correspondances.ISO) {
      return new ConvertisseurCsvExigenceNIS2AvecCorrespondances();
    } else if ((exigence as ExigenceNIS2).correspondances.AE) {
      return new ConvertisseurCsvExigenceNIS2AvecCorrespondancesAE();
    } else if (exigence instanceof ExigenceAE) {
      return new ConvertisseurCsvExigenceAE();
    } else {
      return new ConvertisseurCsvExigenceNIS2();
    }
  }
}
