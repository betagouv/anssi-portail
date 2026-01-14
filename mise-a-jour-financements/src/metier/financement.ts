export type Financement = {
  id: number;
  nom: string;
  financeur: string;
  objectifs: string;
  operationsEligibles: string;
  benificiaires: string;
  montant: string;
  condition: string;
  derniereModification: Date | undefined;
};
