import type { Departement, Organisation } from '../ui/formulaire/SelectionOrganisation.types';

export type InformationsProfessionnelles = {
  prenom: string;
  nom: string;
  email: string;
  organisation?: Organisation;
  telephone?: string;
  domainesSpecialite?: string[];
};

export type InscriptionProps = {
  estimationNombreServices: EstimationNombreServices[];
  informationsProfessionnelles: InformationsProfessionnelles;
  departements: Departement[];
  invite: boolean;
};

export type FormulaireInscription = {
  prenom: string;
  nom: string;
  email: string;
  siretEntite?: string;
  telephone?: string;
  domainesSpecialite: string[];
  estimationNombreServices: Intervalle | null;
  agentConnect: boolean;
  cguAcceptees: boolean;
  infolettreAcceptee: boolean;
  transactionnelAccepte: boolean;
};
