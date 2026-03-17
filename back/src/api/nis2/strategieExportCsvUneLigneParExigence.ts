import {
  Correspondance,
  Exigence,
  ExigenceAE,
  ExigenceISO,
  ExigenceNIS2,
  Referentiel,
} from '../../metier/nis2/exigence';

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

type ExigenceAvecCorrespondances = {
  correspondances: Partial<Record<Referentiel, Correspondance>>;
};

function colonnesEntetesCorrespondances(
  exigences: ExigenceAvecCorrespondances[],
  referentielCompare: Referentiel,
  titreColonneReference: string,
  titreColonneContenu: string
) {
  const nombreCorrespondanceMax = Math.max(
    ...exigences.map(
      (e) => e.correspondances[referentielCompare]?.exigences.length ?? 0
    )
  );

  const resultat = [];

  for (let i = 1; i < nombreCorrespondanceMax + 1; i++) {
    resultat.push({
      id: `reference_${referentielCompare.toLowerCase()}_${i}`,
      title: `${titreColonneReference} (${i})`,
    });
    resultat.push({
      id: `contenu_${referentielCompare.toLowerCase()}_${i}`,
      title: `${titreColonneContenu} (${i})`,
    });
  }
  return resultat;
}

class ConvertisseurCsvExigenceNIS2AvecCorrespondancesISO extends ConvertisseurCsvExigenceNIS2 {
  entetes(exigences: ExigenceNIS2[]) {
    return [
      ...super.entetes(exigences),
      { id: 'correspondance', title: 'Correspondance' },
      ...colonnesEntetesCorrespondances(
        exigences,
        'ISO',
        'Référence ISO',
        'Contenu ISO'
      ),
    ];
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
    return [
      ...super.entetes(exigences),
      { id: 'correspondance', title: 'Correspondance' },
      ...colonnesEntetesCorrespondances(
        exigences,
        'AE',
        'Référence AE',
        'Contenu AE'
      ),
    ];
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
    return [
      ...super.entetes(exigences),
      { id: 'correspondance', title: 'Correspondance' },
      ...colonnesEntetesCorrespondances(
        exigences,
        'NIS2',
        'Référence exigence applicable à NIS 2',
        'Contenu exigence applicable à NIS 2'
      ),
    ];
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

class ConvertisseurCsvExigenceISO extends ConvertisseurCsvExigence<ExigenceISO> {
  entetes(exigences: ExigenceISO[]) {
    return [
      ...super.entetes(exigences),
      { id: 'norme', title: 'Norme' },
      { id: 'chapitre', title: 'Chapitre' },
      { id: 'correspondance', title: 'Correspondance' },
      ...colonnesEntetesCorrespondances(
        exigences,
        'NIS2',
        'Référence exigence applicable à NIS 2',
        'Contenu exigence applicable à NIS 2'
      ),
    ];
  }

  enLigne(exigence: ExigenceISO) {
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
      norme: exigence.norme,
      chapitre: exigence.chapitre,
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
    if (exigence instanceof ExigenceISO) {
      return new ConvertisseurCsvExigenceISO();
    } else if ((exigence as ExigenceNIS2).correspondances.ISO) {
      return new ConvertisseurCsvExigenceNIS2AvecCorrespondancesISO();
    } else if ((exigence as ExigenceNIS2).correspondances.AE) {
      return new ConvertisseurCsvExigenceNIS2AvecCorrespondancesAE();
    } else if (exigence instanceof ExigenceAE) {
      return new ConvertisseurCsvExigenceAE();
    } else {
      return new ConvertisseurCsvExigenceNIS2();
    }
  }
}
