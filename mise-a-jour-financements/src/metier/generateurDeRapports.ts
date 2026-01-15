import { DifferenceFinancement } from './differenceFinancement';

export interface GenerateurDeRapports {
  genereRapportDifference(
    differences: DifferenceFinancement[],
    sortie?: (str: string) => void
  ): Promise<void>;
}
