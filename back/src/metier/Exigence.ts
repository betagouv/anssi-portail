type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

export class Exigence {
  reference: string;
  entitesCible: CategorieEntite[];
  objectifSecurite: string;
  thematique: string;
  contenu: string;

  constructor(parametres: {
    reference: string;
    entitesCible: CategorieEntite[];
    objectifSecurite: string;
    thematique: string;
    contenu: string;
  }) {
    this.reference = parametres.reference;
    this.entitesCible = parametres.entitesCible;
    this.objectifSecurite = parametres.objectifSecurite;
    this.thematique = parametres.thematique;
    this.contenu = parametres.contenu;
  }
}
