import { ResultatEligibilite } from '../Regulation.definitions';

export type ResultatAvecAnalyse = {
  resultat: ResultatEligibilite;
  specificationsRetenues: string[];
};