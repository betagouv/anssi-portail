import { DifferenceFinancement } from './differenceFinancement';

export interface GenerateurDeRapports {
  genereRapportDifference(differences: DifferenceFinancement[]): Promise<void>;
}
