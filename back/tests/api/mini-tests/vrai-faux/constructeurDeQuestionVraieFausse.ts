import { QuestionVraieFausse } from '../../../../src/metier/mini-tests/vrai-faux/questionVraieFausse.js';

export class ConstructeurDeQuestionVraieFausse {
  private idéeReçueEstVraie: boolean = true;
  private explications: string[] = [''];
  private idQuestion: string = 'questionDeTest';
  private réponse: string = '';
  private emojiIdéeReçue: string = '';
  private texteIdéeReçue: string = '';
  private source: string = '';

  avecIdéeReçueEstVraie(idéeReçueEstVraie: boolean) {
    this.idéeReçueEstVraie = idéeReçueEstVraie;
    return this;
  }

  avecLesExplications(explications: string[]) {
    this.explications = explications;
    return this;
  }

  avecLIdQuestion(idQuestion: string) {
    this.idQuestion = idQuestion;
    return this;
  }

  avecLaRéponse(réponse: string) {
    this.réponse = réponse;
    return this;
  }

  avecLIdéeReçue(emoji: string, texte: string) {
    this.emojiIdéeReçue = emoji;
    this.texteIdéeReçue = texte;
    return this;
  }

  avecLaSource(source: string) {
    this.source = source;
    return this;
  }

  construis(): QuestionVraieFausse {
    return {
      idéeReçueEstVraie: this.idéeReçueEstVraie,
      explications: this.explications,
      idQuestion: this.idQuestion,
      réponse: this.réponse,
      idéeReçue: {
        emoji: this.emojiIdéeReçue,
        texte: this.texteIdéeReçue,
      },
      source: this.source,
    };
  }
}

export function questionVraieFausseDeTest() {
  return new ConstructeurDeQuestionVraieFausse();
}
