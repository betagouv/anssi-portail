export type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

export type Referentiel = 'NIS2' | 'ISO';

export class Exigence {
  reference: string;
  contenu: string;

  constructor(parametres: { reference: string; contenu: string }) {
    this.reference = parametres.reference;
    this.contenu = parametres.contenu;
  }
}

type Correspondance = {
  niveau?: string;
  observations?: string;
  exigences: Exigence[];
};

export class ExigenceNIS2 extends Exigence {
  entitesCible: CategorieEntite[];
  objectifSecurite: string;
  thematique: string;
  correspondances: Partial<Record<Referentiel, Correspondance>>;

  constructor(parametres: {
    reference: string;
    entitesCible: CategorieEntite[];
    objectifSecurite: string;
    thematique: string;
    contenu: string;
    referentielCompare?: Referentiel;
    niveau?: Correspondance['niveau'];
    observations?: Correspondance['observations'];
    exigences?: Correspondance['exigences'];
  }) {
    super(parametres);
    this.entitesCible = parametres.entitesCible;
    this.objectifSecurite = parametres.objectifSecurite;
    this.thematique = parametres.thematique;
    this.correspondances = {};
    if (parametres.referentielCompare) {
      const correspondance: Correspondance = {
        niveau: parametres.niveau,
        exigences: parametres.exigences ?? [],
        observations: parametres.observations,
      };
      this.correspondances = {
        [parametres.referentielCompare]: correspondance,
      };
    }
  }
}

export class ExigenceISO extends Exigence {}
