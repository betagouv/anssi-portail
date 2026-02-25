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

export class ExigenceNIS2 extends Exigence {
  entitesCible: CategorieEntite[];
  objectifSecurite: string;
  thematique: string;

  constructor(parametres: {
    reference: string;
    entitesCible: CategorieEntite[];
    objectifSecurite: string;
    thematique: string;
    contenu: string;
  }) {
    super(parametres);
    this.entitesCible = parametres.entitesCible;
    this.objectifSecurite = parametres.objectifSecurite;
    this.thematique = parametres.thematique;
  }
}

export class ExigenceISO extends Exigence {}
