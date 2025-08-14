export type ResumeFinancement = {
  id: number;
  entitesElligibles: string[];
  financeur: string;
  nom: string;
  typesDeFinancement: string[];
  perimetresGeographiques: string[];
};

export type Financement = ResumeFinancement & {
  objectifs: string;
  operationsEligibles: string;
  benificiaires: string;
  montant: string;
  condition: string;
  sources: string[];
  contact: string;
};
