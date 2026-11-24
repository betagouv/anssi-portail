export type RésuméFinancement = {
  id: number;
  entitésÉligibles: string[];
  financeur: string;
  nom: string;
  typesDeFinancement: string[];
  périmètresGéographiques: string[];
  régions: string[];
};

export type Financement = RésuméFinancement & {
  objectifs: string;
  opérationsÉligibles: string;
  bénéficiaires: string;
  montant: string;
  condition: string;
  sources: string[];
  contact: string;
};
