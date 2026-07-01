import type { UnionDe } from './UnionDe.js';
import type { Activite } from './Activite.definitions.js';
import {
  ValeursappartenancePaysUnionEuropeenne,
  ValeursDesignationOperateurServicesEssentiels,
  ValeursOuiNon,
  ValeursPetitMoyenGrand,
  ValeursTypeEntitePublique,
  ValeursTypeStructure,
} from './ChampsSimulateur.valeurs.js';
import type { SecteurActivite } from './SecteurActivite.definitions.js';
import type { SousSecteurActivite } from './SousSecteurActivite.definitions.js';

export type DesignationOperateurServicesEssentiels = UnionDe<typeof ValeursDesignationOperateurServicesEssentiels>;
export type AppartenancePaysUnionEuropeenne = UnionDe<typeof ValeursappartenancePaysUnionEuropeenne>;
export type TypeStructure = UnionDe<typeof ValeursTypeStructure>;
export type TypeEntitePublique = UnionDe<typeof ValeursTypeEntitePublique>;
export type UnionPetitMoyenGrand = UnionDe<typeof ValeursPetitMoyenGrand>;
export type TrancheNombreEmployes = UnionPetitMoyenGrand;
export type TrancheChiffreAffaire = UnionPetitMoyenGrand;
export type TrancheBilanFinancier = UnionPetitMoyenGrand;
export type FournitServicesUnionEuropeenne = UnionDe<typeof ValeursOuiNon>;
export type ValeurChampSimulateur =
  | DesignationOperateurServicesEssentiels
  | AppartenancePaysUnionEuropeenne
  | TypeStructure
  | TypeEntitePublique
  | TrancheChiffreAffaire
  | TrancheNombreEmployes
  | SecteurActivite
  | SousSecteurActivite
  | Activite
  | FournitServicesUnionEuropeenne;
