import type { ExigenceNis2 } from '../nis2/exigence.type';

export type Risque = {
  libelle: string;
  description: string;
};

export type Tutoriel = {
  titre: string;
  description?: string;
  étapes: string[];
  note?: string;
  lienPourAllerPlusLoin?: {
    libelle: string;
    url: string;
  };
};

export type Mesure = {
  id: string;
  titre: string;
  phraseAccroche: string;
  explications: string;
  actionPrioritaire: string;
  actionFacileAFaire: string;
  ordre: number;
  risques: Risque[];
  tutoriels: Tutoriel[];
  liens: {
    libelle: string;
    url: string;
  }[];
  exigences: ExigenceNis2[];
  estPriseEnCompte: boolean;
  idModule: number;
};

export type Module = {
  id: number;
  nom: string;
  nombreMesuresTotal: number;
  nombreMesuresPrisesEnCompte: number;
  cibleBadge?: number;
};
