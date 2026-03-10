export type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

const referentiels = ['NIS2', 'ISO', 'AE'] as const;
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

export type Niveau = 'NA' | 'faible' | 'moyen' | 'élevé';

export class Correspondance {
  readonly niveau: Niveau;
  readonly observations: string;
  readonly exigences: Exigence[];

  constructor(niveau?: Niveau, observations?: string, exigences?: Exigence[]) {
    this.niveau = niveau ?? 'NA';
    this.observations = observations ?? '';
    this.exigences = exigences ?? [];
  }
}

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
    correspondance?: Correspondance;
  }) {
    super(parametres);
    this.entitesCible = parametres.entitesCible;
    this.objectifSecurite = parametres.objectifSecurite;
    this.thematique = parametres.thematique;
    this.correspondances = {};
    if (parametres.referentielCompare && parametres.correspondance) {
      this.correspondances = {
        [parametres.referentielCompare]: parametres.correspondance,
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
    correspondance: Correspondance;
  }) {
    super(parametres);
    this.norme = parametres.norme;
    this.chapitre = parametres.chapitre;
    this.correspondances = {
      NIS2: parametres.correspondance,
    };
  }
}

export class ExigenceAE extends Exigence {
  correspondances: Partial<Record<Referentiel, Correspondance>>;

  constructor(parametres: {
    reference: string;
    contenu: string;
    correspondance: Correspondance;
  }) {
    super(parametres);
    this.correspondances = {
      NIS2: parametres.correspondance,
    };
  }
}
