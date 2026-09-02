import { EvenementDuBus } from '../busEvenements.js';

export class RéponsesVraieFausseSoumise implements EvenementDuBus {
  readonly idCorrélation: string;
  readonly idQuestion: string;
  readonly réponseCorrecte: boolean;
  constructor({
    idCorrélation,
    idQuestion,
    réponseCorrecte,
  }: {
    idCorrélation: string;
    idQuestion: string;
    réponseCorrecte: boolean;
  }) {
    this.idCorrélation = idCorrélation;
    this.idQuestion = idQuestion;
    this.réponseCorrecte = réponseCorrecte;
  }
}
