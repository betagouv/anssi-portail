export type CategorieEntite = 'EntiteEssentielle' | 'EntiteImportante';

export type ExigenceNis2 = {
  reference: string;
  objectifSecurite: string;
  thematique: string;
  contenu: string;
  entitesCible: CategorieEntite[];
  correspondances: {
    ISO: {
      niveau: string;
      exigences: {
        reference: string;
        contenu: string;
      }[];
      observations: string;
    };
  };
};

export const badgesExigence = (exigence: ExigenceNis2) => {
  return exigence.entitesCible.map((categorie) => ({
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
