import type { Organisation } from '../ui/formulaire/SelectionOrganisation.types';

export type InformationsProfessionnelles = {
  prenom: string;
  nom: string;
  email: string;
  organisation?: Organisation;
  telephone?: string;
  domainesSpecialite?: string[];
};

export type FormulaireInscription = {
  prenom: string;
  nom: string;
  email: string;
  siretEntite?: string;
  telephone?: string;
  domainesSpecialite: string[];
  cguAcceptees: boolean;
  infolettreAcceptee: boolean;
};
