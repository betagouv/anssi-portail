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
};
