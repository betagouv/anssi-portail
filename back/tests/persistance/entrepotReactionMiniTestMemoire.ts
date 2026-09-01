import { EntrepotReactionMiniTest } from '../../src/metier/mini-tests/entrepotReactionMiniTest.js';
import { RéactionMiniTest } from '../../src/metier/mini-tests/reactionMiniTest.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepotReactionMiniTestMemoire
  extends EntrepotMemoire<RéactionMiniTest>
  implements EntrepotReactionMiniTest {}
