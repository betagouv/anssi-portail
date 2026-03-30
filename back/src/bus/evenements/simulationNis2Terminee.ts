import { ReponsesEtResultatAvecAnalyse } from '../../metier/nis2-simulateur/questionnaire/calculEligibilite';

export class SimulationNis2Terminee {
  readonly reponses: ReponsesEtResultatAvecAnalyse;

  constructor(donnees: ReponsesEtResultatAvecAnalyse) {
    this.reponses = donnees;
  }
}
