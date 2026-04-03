import * as fs from 'node:fs';
import type { EtatQuestionnaire } from '../EtatQuestionnaire';
import type { ResultatAvecAnalyse } from './ResultatAvecAnalyse';
import { evalueEligibilite } from './evalueEligibilite';

export type ReponsesEtResultatAvecAnalyse = {
  reponses: EtatQuestionnaire;
  eligibilite: ResultatAvecAnalyse;
};

export class CalculEligibilite {
  private readonly contenuDuCsv: string;

  constructor(cheminCsvSpecifications: string) {
    const csvIntrouvable = !fs.existsSync(cheminCsvSpecifications);
    if (csvIntrouvable) {
      throw new Error(`Impossible de trouver le CSV de spécifications. Chemin : "${cheminCsvSpecifications}".`);
    }

    this.contenuDuCsv = fs.readFileSync(cheminCsvSpecifications).toString('utf-8');
  }

  evalueEligibilite(reponses: EtatQuestionnaire): ReponsesEtResultatAvecAnalyse {
    const eligibilite = evalueEligibilite(reponses, this.contenuDuCsv);
    return { reponses, eligibilite };
  }
}
