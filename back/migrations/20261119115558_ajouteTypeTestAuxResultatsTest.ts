import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table
      .text('type_test')
      .comment('Type du test cyber associé au résultat, colonne discriminante')
      .checkIn(['maturité cyber'], 'resultats_test_type_test_valide');
  });

  await knex('resultats_test').update({ type_test: 'maturité cyber' });

  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropNullable('type_test');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropColumn('type_test');
  });
}
