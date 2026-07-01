import type { ResultatEligibilite } from '../Regulation.definitions.js';

export type ResultatAvecAnalyse = {
  resultat: ResultatEligibilite;
  specificationsRetenues: string[];
};
