import { DifferenceFinancement } from './differenceFinancement';
import { NouveauFinancement } from './nouveauFinancement';

export interface GenerateurDeRapports {
  genereRapports(
    differences: DifferenceFinancement[],
    nouveauxFinancements: NouveauFinancement[]
  ): Promise<void>;
}
