import { LecteurDeSpecifications } from './LecteurDeSpecifications.js';
import type { EtatQuestionnaire } from '../EtatQuestionnaire.js';
import type { ResultatAvecAnalyse } from './ResultatAvecAnalyse.js';

export function evalueEligibilite(reponses: EtatQuestionnaire, contenuDuCsv: string): ResultatAvecAnalyse {
  const lecteur = new LecteurDeSpecifications();
  const specifications = lecteur.lis(contenuDuCsv);
  return specifications.evalue(reponses);
}
