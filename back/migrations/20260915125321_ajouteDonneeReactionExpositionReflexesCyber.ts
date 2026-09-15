import type { Knex } from 'knex';

const miniTests = ['Exposition', 'ReflexesCyber'];
const typesReaction = ['❤️', '🔥', '👍'];
export async function up(knex: Knex): Promise<void> {
  await knex('reactions_mini_tests')
    .insert(
      miniTests.flatMap((miniTest) =>
        typesReaction.map((typeReaction) => ({ mini_test: miniTest, type_reaction: typeReaction, compteur: 0 }))
      )
    )
    .onConflict()
    .ignore();
}

export async function down(knex: Knex): Promise<void> {
  await knex('reactions_mini_tests').whereIn('mini_test', miniTests).del();
}
