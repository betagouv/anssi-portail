import type { Knex } from 'knex';

const miniTests = ['VraiFaux', 'MaturiteCyber'];
const typesReaction = ['❤️', '🔥', '👍'];

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('reactions_mini_tests', (table) => {
    table.text('mini_test').notNullable();
    table.text('type_reaction').notNullable();
    table.integer('compteur').notNullable().defaultTo(0);
    table.primary(['mini_test', 'type_reaction']);
  });

  await knex('reactions_mini_tests').insert(
    miniTests.flatMap((miniTest) =>
      typesReaction.map((typeReaction) => ({ mini_test: miniTest, type_reaction: typeReaction, compteur: 0 }))
    )
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('reactions_mini_tests');
}
