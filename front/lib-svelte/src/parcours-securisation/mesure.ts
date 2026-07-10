import type { ExigenceNis2 } from '../nis2/exigence.type';

export type Risque = {
  libelle: string;
  description: string;
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
  tutoriel?: { titre: string; image?: string };
  liens: {
    libelle: string;
    url: string;
  }[];
  exigences: ExigenceNis2[];
  estPriseEnCompte: boolean;
};

export type Module = {
  id: number;
  nom: string;
  nombreMesuresTotal: number;
};
