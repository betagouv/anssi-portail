import type { ResultatEligibilite } from '../Regulation.definitions';

export type ResultatAvecAnalyse = {
  resultat: ResultatEligibilite;
  specificationsRetenues: string[];
};
