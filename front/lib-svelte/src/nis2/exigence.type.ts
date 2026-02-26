export type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

export type ExigenceNis2 = {
  reference: string;
  objectifSecurite: string;
  thematique: string;
  contenu: string;
  entitesCible: CategorieEntite[];
};

export type Referentiel = 'NIS2' | 'ISO' | '';
export type ReferentielSelectionne = Exclude<Referentiel, 'NIS2'>;
