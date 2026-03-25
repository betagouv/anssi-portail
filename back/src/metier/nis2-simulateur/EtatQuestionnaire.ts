import type { TypeEtape } from "./InformationsEtape";
import type {
  AppartenancePaysUnionEuropeenne,
  DesignationOperateurServicesEssentiels,
  TrancheBilanFinancier,
  TrancheChiffreAffaire,
  TrancheNombreEmployes,
  TypeEntitePublique,
  TypeStructure,
} from "./ChampsSimulateur.definitions";
import type { SecteurActivite } from "./SecteurActivite.definitions";
import type { SousSecteurActivite } from "./SousSecteurActivite.definitions";
import type { Activite } from "./Activite.definitions";

export type EtatQuestionnaire = {
  etapeCourante: TypeEtape;
  designationOperateurServicesEssentiels: DesignationOperateurServicesEssentiels[];
  appartenancePaysUnionEuropeenne: AppartenancePaysUnionEuropeenne[];
  typeStructure: TypeStructure[];
  trancheNombreEmployes: TrancheNombreEmployes[];
  trancheChiffreAffaire: TrancheChiffreAffaire[];
  trancheBilanFinancier: TrancheBilanFinancier[];
  secteurActivite: SecteurActivite[];
  sousSecteurActivite: SousSecteurActivite[];
  activites: Activite[];
  typeEntitePublique: TypeEntitePublique[];
  localisationFournitureServicesNumeriques: AppartenancePaysUnionEuropeenne[];
  paysDecisionsCyber: AppartenancePaysUnionEuropeenne[];
  paysOperationsCyber: AppartenancePaysUnionEuropeenne[];
  paysPlusGrandNombreSalaries: AppartenancePaysUnionEuropeenne[];
};

export const EtatQuestionnaireVide: EtatQuestionnaire = {
  etapeCourante: "prealable",
  designationOperateurServicesEssentiels: [],
  appartenancePaysUnionEuropeenne: [],
  typeStructure: [],
  trancheNombreEmployes: [],
  trancheChiffreAffaire: [],
  trancheBilanFinancier: [],
  secteurActivite: [],
  sousSecteurActivite: [],
  activites: [],
  typeEntitePublique: [],
  localisationFournitureServicesNumeriques: [],
  paysDecisionsCyber: [],
  paysOperationsCyber: [],
  paysPlusGrandNombreSalaries: [],
};
