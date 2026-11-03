import type { Knex } from 'knex';

const typesReaction = ['❤️', '🔥', '👍'];

export async function up(knex: Knex): Promise<void> {
  await knex('reactions_mini_tests').insert(
    typesReaction.map((typeReaction) => ({ mini_test: 'Hameconnage', type_reaction: typeReaction, compteur: 0 }))
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex('reactions_mini_tests').where({ mini_test: 'Hameconnage' }).del();
}
