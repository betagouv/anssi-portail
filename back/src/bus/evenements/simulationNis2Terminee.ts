import { EtatQuestionnaire } from '../../metier/nis2-simulateur/EtatQuestionnaire';

export class SimulationNis2Terminee {
  readonly reponses: EtatQuestionnaire;

  constructor(donnees: EtatQuestionnaire) {
    this.reponses = donnees;
  }
}
