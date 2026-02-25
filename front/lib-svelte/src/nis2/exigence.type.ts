export type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

export type ExigenceNis2 = {
  reference: string;
  objectifSecurite: string;
  thematique: string;
  contenu: string;
  entitesCible: CategorieEntite[];
};
