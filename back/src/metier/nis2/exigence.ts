export type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

const referentiels = ['NIS2', 'ISO'] as const;
export type Referentiel = (typeof referentiels)[number];

export const estReferentiel = (valeur: string): valeur is Referentiel =>
  referentiels.some((r) => r === valeur);

export class Exigence {
  reference: string;
  contenu: string;

  constructor(parametres: { reference: string; contenu: string }) {
    this.reference = parametres.reference;
    this.contenu = parametres.contenu;
  }
}

export type Correspondance = {
  niveau: 'NA' | 'faible' | 'moyen' | 'élevé';
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
        niveau: parametres.niveau ?? 'NA',
        exigences: parametres.exigences ?? [],
        observations: parametres.observations,
      };
      this.correspondances = {
        [parametres.referentielCompare]: correspondance,
      };
    }
  }
}

export class ExigenceISO extends Exigence {
  norme: string;
  chapitre: string;
  correspondances: Partial<Record<Referentiel, Correspondance>>;

  constructor(parametres: {
    reference: string;
    norme: string;
    chapitre: string;
    contenu: string;
    niveau?: Correspondance['niveau'];
    observations?: Correspondance['observations'];
    exigences?: Correspondance['exigences'];
  }) {
    super(parametres);
    this.norme = parametres.norme;
    this.chapitre = parametres.chapitre;
    this.correspondances = {
      NIS2: {
        niveau: parametres.niveau ?? 'NA',
        exigences: parametres.exigences ?? [],
        observations: parametres.observations,
      },
    };
  }
}
