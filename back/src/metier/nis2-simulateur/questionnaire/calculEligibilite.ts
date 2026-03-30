import * as fs from 'node:fs';
import * as path from 'node:path';
import type { EtatQuestionnaire } from '../EtatQuestionnaire';
import type { ResultatAvecAnalyse } from './ResultatAvecAnalyse';
import { evalueEligibilite } from './evalueEligibilite';

export type ReponsesEtResultatAvecAnalyse = {
  reponses: EtatQuestionnaire;
  eligibilite: ResultatAvecAnalyse;
};

export class CalculEligibilite {
  private readonly contenuDuCsv: string;

  constructor() {
    const csv = path.normalize(`${__dirname}/specifications-completes.csv`);

    const csvIntrouvable = !fs.existsSync(csv);
    if (csvIntrouvable) {
      throw new Error(`Impossible de trouver le CSV de spécifications. Chemin : "${csv}".`);
    }

    this.contenuDuCsv = fs.readFileSync(csv).toString('utf-8');
  }

  evalueEligibilite(reponses: EtatQuestionnaire): ReponsesEtResultatAvecAnalyse {
    const eligibilite = evalueEligibilite(reponses, this.contenuDuCsv);
    return { reponses, eligibilite };
  }
}
