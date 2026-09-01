import { QuestionVraieFausse } from './questionVraieFausse.js';

export interface EntrepôtQuestionVraieFausse {
  tous(): Promise<QuestionVraieFausse[]>;
}
