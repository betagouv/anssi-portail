import { RéactionMiniTest } from './reactionMiniTest.js';

export interface EntrepotReactionMiniTest {
  ajoute(réactionMiniTest: RéactionMiniTest): Promise<void>;

  tous(): Promise<RéactionMiniTest[]>;
}
