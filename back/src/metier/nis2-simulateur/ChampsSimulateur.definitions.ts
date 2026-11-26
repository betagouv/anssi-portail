import {
  ValeursappartenancePaysUnionEuropeenne,
  ValeursDesignationOperateurServicesEssentiels,
  ValeursPetitMoyenGrand,
  ValeursTypeEntitePublique,
  ValeursTypeStructure,
} from './ChampsSimulateur.valeurs.js';
import type { UnionDe } from './UnionDe.js';

export type DesignationOperateurServicesEssentiels = UnionDe<typeof ValeursDesignationOperateurServicesEssentiels>;
export type AppartenancePaysUnionEuropeenne = UnionDe<typeof ValeursappartenancePaysUnionEuropeenne>;
export type TypeStructure = UnionDe<typeof ValeursTypeStructure>;
export type TypeEntitePublique = UnionDe<typeof ValeursTypeEntitePublique>;
export type UnionPetitMoyenGrand = UnionDe<typeof ValeursPetitMoyenGrand>;
export type TrancheNombreEmployes = UnionPetitMoyenGrand;
export type TrancheChiffreAffaire = UnionPetitMoyenGrand;
export type TrancheBilanFinancier = UnionPetitMoyenGrand;
