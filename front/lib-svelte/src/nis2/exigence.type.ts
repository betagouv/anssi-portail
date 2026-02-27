export type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

export type ExigenceComparee = {
  reference: string;
  contenu: string;
};

export type Correspondance = {
  niveau: 'NA' | 'faible' | 'moyen' | 'élevé';
  exigences: ExigenceComparee[];
  observations: string;
};

export type ExigenceNis2 = {
  reference: string;
  objectifSecurite: string;
  thematique: string;
  contenu: string;
  entitesCible: CategorieEntite[];
  correspondances: {
    ISO: Correspondance;
  };
};

export type ExigenceISO = {
  norme: string;
  chapitre: string;
  reference: string;
  contenu: string;
  correspondances: {
    NIS2: Correspondance;
  };
};

export type Exigence = ExigenceNis2 | ExigenceISO;

export const recupereCorrespondance = (exigence: Exigence): Correspondance => {
  if ('objectifSecurite' in exigence) {
    return exigence.correspondances.ISO;
  } else {
    return exigence.correspondances.NIS2;
  }
};

export const badgesExigence = (exigence: ExigenceNis2) => {
  return exigence?.entitesCible.map((categorie) => ({
    label: {
      EntiteImportante: 'EI',
      EntiteEssentielle: 'EE',
    }[categorie],
    accent: {
      EntiteImportante: 'green-archipel',
      EntiteEssentielle: 'green-bourgeon',
    }[categorie],
  }));
};

export type Referentiel = 'NIS2' | 'ISO' | '';
export type ReferentielSelectionne = Exclude<Referentiel, 'NIS2'>;
