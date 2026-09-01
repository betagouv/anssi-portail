import { EntrepôtQuestionVraieFausse } from '../../src/metier/mini-tests/vrai-faux/entrepotQuestionVraieFausse.js';
import { QuestionVraieFausse } from '../../src/metier/mini-tests/vrai-faux/questionVraieFausse.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepôtQuestionVraieFausseMémoire
  extends EntrepotMemoire<QuestionVraieFausse>
  implements EntrepôtQuestionVraieFausse {}
