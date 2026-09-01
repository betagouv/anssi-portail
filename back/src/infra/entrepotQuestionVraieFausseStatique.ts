import { EntrepôtQuestionVraieFausse } from '../metier/mini-tests/vrai-faux/entrepotQuestionVraieFausse.js';
import { QuestionVraieFausse } from '../metier/mini-tests/vrai-faux/questionVraieFausse.js';

export class EntrepôtQuestionVraieFausseStatique implements EntrepôtQuestionVraieFausse {
  tous(): Promise<QuestionVraieFausse[]> {
    throw new Error('Method not implemented.');
  }
}
