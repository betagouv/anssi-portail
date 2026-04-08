import { LecteurDeSpecifications } from './LecteurDeSpecifications';
import type { EtatQuestionnaire } from '../EtatQuestionnaire';
import type { ResultatAvecAnalyse } from './ResultatAvecAnalyse';

export function evalueEligibilite(reponses: EtatQuestionnaire, contenuDuCsv: string): ResultatAvecAnalyse {
  const lecteur = new LecteurDeSpecifications();
  const specifications = lecteur.lis(contenuDuCsv);
  return specifications.evalue(reponses);
}
