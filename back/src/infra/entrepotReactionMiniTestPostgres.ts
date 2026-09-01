import Knex from 'knex';
import config from '../../knexfile.js';
import { EntrepotReactionMiniTest } from '../metier/mini-tests/entrepotReactionMiniTest.js';
import { IdentifiantMiniTest, RéactionMiniTest, TypeRéaction } from '../metier/mini-tests/reactionMiniTest.js';

type RéactionMiniTestPersistee = {
  mini_test: string;
  type_reaction: string;
  compteur: number;
};

export class EntrepotReactionMiniTestPostgres implements EntrepotReactionMiniTest {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async ajoute(réactionMiniTest: RéactionMiniTest): Promise<void> {
    await this.knex<RéactionMiniTestPersistee>('reactions_mini_tests').insert({
      mini_test: réactionMiniTest.id,
      type_reaction: réactionMiniTest.typeRéaction,
      compteur: réactionMiniTest.compteur,
    });
  }

  async metsÀJour(réactionMiniTest: RéactionMiniTest): Promise<void> {
    await this.knex<RéactionMiniTestPersistee>('reactions_mini_tests')
      .update({
        compteur: réactionMiniTest.compteur,
      })
      .where({ mini_test: réactionMiniTest.id, type_reaction: réactionMiniTest.typeRéaction });
  }

  async tous(): Promise<RéactionMiniTest[]> {
    const réactions = await this.knex<RéactionMiniTestPersistee>('reactions_mini_tests');
    return réactions.map(
      ({ mini_test: miniTest, type_reaction: typeReaction, compteur }) =>
        new RéactionMiniTest(miniTest as IdentifiantMiniTest, typeReaction as TypeRéaction, compteur)
    );
  }
}
