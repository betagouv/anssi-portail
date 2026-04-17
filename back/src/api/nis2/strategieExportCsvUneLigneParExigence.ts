import {
  Exigence,
  ExigenceAE,
  ExigenceAvecCorrespondances,
  ExigenceCyFun23,
  ExigenceISO,
  ExigenceNIS2,
  Langue,
  Referentiel,
} from '../../metier/nis2/exigence';

class ConvertisseurCsvExigence<T extends Exigence> {
  langue: Langue = 'FR';
  entetes(_exigences: T[]): { id: string; title: string }[] {
    return [
      { id: 'reference', title: 'Référence' },
      { id: 'contenu', title: 'Contenu' },
    ];
  }

  enLigne(exigence: T): Record<string, string> {
    return {
      reference: exigence.reference,
      contenu: this.langue === 'EN' ? exigence.contenuEnAnglais : exigence.contenu,
    };
  }

  protected extraisCorrespondances(exigence: ExigenceAvecCorrespondances, referentiel: Referentiel) {
    return exigence.correspondances[referentiel]!.exigences.reduce((valeurPrecedente, valeurActuelle, index) => {
      return {
        ...valeurPrecedente,
        [`reference_${referentiel.toLowerCase()}_${index + 1}`]: valeurActuelle.reference,
        [`contenu_${referentiel.toLowerCase()}_${index + 1}`]:
          this.langue === 'EN' ? valeurActuelle.contenuEnAnglais : valeurActuelle.contenu,
      };
    }, {});
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

function colonnesEntetesCorrespondances(
  exigences: ExigenceAvecCorrespondances[],
  referentielCompare: Referentiel,
  titreColonneReference: string,
  titreColonneContenu: string
) {
  const nombreCorrespondanceMax = Math.max(
    ...exigences.map((e) => e.correspondances[referentielCompare]?.exigences.length ?? 0)
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

abstract class ConvertisseurCsvExigenceNIS2AvecCorrespondances extends ConvertisseurCsvExigenceNIS2 {
  entetes(exigences: ExigenceNIS2[]) {
    return [
      ...super.entetes(exigences),
      { id: 'correspondance', title: 'Correspondance' },
      { id: 'observations', title: 'Observations' },
    ];
  }

  enLigne(exigenceNIS2: ExigenceNIS2) {
    const referentiel = this.referentielDeCorrespondance();
    return {
      ...super.enLigne(exigenceNIS2),
      correspondance: exigenceNIS2.correspondances[referentiel]!.niveau,
      observations: exigenceNIS2.correspondances[referentiel]!.observations,
      ...this.extraisCorrespondances(exigenceNIS2, referentiel),
    };
  }

  protected abstract referentielDeCorrespondance(): Referentiel;
}

class ConvertisseurCsvExigenceNIS2AvecCorrespondancesISO extends ConvertisseurCsvExigenceNIS2AvecCorrespondances {
  entetes(exigences: ExigenceNIS2[]) {
    return [
      ...super.entetes(exigences),
      ...colonnesEntetesCorrespondances(exigences, 'ISO', 'Référence ISO', 'Contenu ISO'),
    ];
  }

  protected override referentielDeCorrespondance(): Referentiel {
    return 'ISO';
  }
}

class ConvertisseurCsvExigenceNIS2AvecCorrespondancesAE extends ConvertisseurCsvExigenceNIS2AvecCorrespondances {
  entetes(exigences: ExigenceNIS2[]) {
    return [
      ...super.entetes(exigences),
      ...colonnesEntetesCorrespondances(
        exigences,
        'AE',
        'Référence Annexe au Règlement d’exécution 2024/2690',
        'Contenu Annexe au Règlement d’exécution 2024/2690'
      ),
    ];
  }

  protected override referentielDeCorrespondance(): Referentiel {
    return 'AE';
  }
}

class ConvertisseurCsvExigenceNIS2AvecCorrespondancesCyFun23 extends ConvertisseurCsvExigenceNIS2AvecCorrespondances {
  entetes(exigences: ExigenceNIS2[]) {
    return [
      ...super.entetes(exigences),
      ...colonnesEntetesCorrespondances(exigences, 'CyFun23', 'Référence CyFun23', 'Contenu CyFun23'),
    ];
  }

  protected override referentielDeCorrespondance(): Referentiel {
    return 'CyFun23';
  }
}

class ConvertisseurCsvExigenceAE extends ConvertisseurCsvExigence<ExigenceAE> {
  entetes(exigences: ExigenceAE[]) {
    return [
      ...super.entetes(exigences),
      { id: 'correspondance', title: 'Correspondance' },
      { id: 'observations', title: 'Observations' },
      ...colonnesEntetesCorrespondances(
        exigences,
        'NIS2',
        'Référence exigence applicable à NIS 2',
        'Contenu exigence applicable à NIS 2'
      ),
    ];
  }

  enLigne(exigence: ExigenceAE) {
    return {
      ...super.enLigne(exigence),
      correspondance: exigence.correspondances.NIS2!.niveau,
      observations: exigence.correspondances.NIS2!.observations,
      ...this.extraisCorrespondances(exigence, 'NIS2'),
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
      { id: 'observations', title: 'Observations' },
      ...colonnesEntetesCorrespondances(
        exigences,
        'NIS2',
        'Référence exigence applicable à NIS 2',
        'Contenu exigence applicable à NIS 2'
      ),
    ];
  }

  enLigne(exigence: ExigenceISO) {
    return {
      ...super.enLigne(exigence),
      norme: exigence.norme,
      chapitre: exigence.chapitre,
      correspondance: exigence.correspondances.NIS2!.niveau,
      observations: exigence.correspondances.NIS2!.observations,
      ...this.extraisCorrespondances(exigence, 'NIS2'),
    };
  }
}

class ConvertisseurCsvExigenceCyFun23 extends ConvertisseurCsvExigence<ExigenceCyFun23> {
  entetes(exigences: ExigenceCyFun23[]) {
    return [
      ...super.entetes(exigences),
      { id: 'fonction', title: 'Fonction' },
      { id: 'est_mesure_cle', title: 'Mesure clé' },
      { id: 'niveau_assurance', title: 'Niveau d’assurance' },
      { id: 'correspondance', title: 'Correspondance' },
      { id: 'observations', title: 'Observations' },
      ...colonnesEntetesCorrespondances(
        exigences,
        'NIS2',
        'Référence exigence applicable à NIS 2',
        'Contenu exigence applicable à NIS 2'
      ),
    ];
  }

  enLigne(exigence: ExigenceCyFun23) {
    return {
      ...super.enLigne(exigence),
      fonction: exigence.fonction ?? '',
      niveau_assurance: exigence.niveauAssurance ?? '',
      est_mesure_cle: exigence.estMesureCle ? 'Oui' : 'Non',
      correspondance: exigence.correspondances.NIS2!.niveau,
      observations: exigence.correspondances.NIS2!.observations,
      ...this.extraisCorrespondances(exigence, 'NIS2'),
    };
  }
}

export class StrategieExportCsvUneLigneParExigence {
  entetes = (exigences: Exigence[]) => {
    if (exigences.length === 0) return [];
    const convertisseurCsv = this.convertisseurCsv(exigences[0]);
    return convertisseurCsv.entetes(exigences);
  };

  lignes = (exigences: Exigence[], langue: Langue = 'FR') =>
    exigences.map((exigence) => {
      const convertisseurCsv = this.convertisseurCsv(exigence);
      convertisseurCsv.langue = langue;
      return convertisseurCsv.enLigne(exigence);
    });

  private convertisseurCsv(exigence: Exigence): ConvertisseurCsvExigence<Exigence> {
    if (exigence instanceof ExigenceISO) {
      return new ConvertisseurCsvExigenceISO();
    } else if ((exigence as ExigenceNIS2).correspondances.ISO) {
      return new ConvertisseurCsvExigenceNIS2AvecCorrespondancesISO();
    } else if ((exigence as ExigenceNIS2).correspondances.AE) {
      return new ConvertisseurCsvExigenceNIS2AvecCorrespondancesAE();
    } else if ((exigence as ExigenceNIS2).correspondances.CyFun23) {
      return new ConvertisseurCsvExigenceNIS2AvecCorrespondancesCyFun23();
    } else if (exigence instanceof ExigenceAE) {
      return new ConvertisseurCsvExigenceAE();
    } else if (exigence instanceof ExigenceCyFun23) {
      return new ConvertisseurCsvExigenceCyFun23();
    } else {
      return new ConvertisseurCsvExigenceNIS2();
    }
  }
}
