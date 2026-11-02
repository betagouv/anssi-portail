import { EvenementDuBus } from '../busEvenements.js';

export class TestHameçonnageRéponseSoumise implements EvenementDuBus {
  readonly idCorrélation: string;
  readonly idMail: string;
  readonly réponseCorrecte: boolean;

  constructor({
    idCorrélation,
    idMail,
    réponseCorrecte,
  }: {
    idCorrélation: string;
    idMail: string;
    réponseCorrecte: boolean;
  }) {
    this.idCorrélation = idCorrélation;
    this.idMail = idMail;
    this.réponseCorrecte = réponseCorrecte;
  }
}
