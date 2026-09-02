import { EvenementDuBus } from '../busEvenements.js';

export class QuestionnaireVraiFauxTerminé implements EvenementDuBus {
  readonly idCorrélation: string;
  constructor({ idCorrélation }: { idCorrélation: string }) {
    this.idCorrélation = idCorrélation;
  }
}
