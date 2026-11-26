export type EtapeTest = {
  titre: string;
  question: string;
  propositions: string[];
  id: IdRubrique | 'infos-complementaires';
};

export type Question = {
  titre: string;
  question: string;
  propositions: string[];
  id: IdRubrique;
};

export type IdRubrique =
  | 'pilotage'
  | 'budget'
  | 'ressources-humaines'
  | 'adoption-solutions'
  | 'prise-en-compte-risque'
  | 'posture';

export type Rubrique = {
  id: IdRubrique;
  label: string;
  ancrageTexte: 'start' | 'end';
  alignementVertical: 'middle' | 'auto' | 'hanging';
  lettre: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
};
