import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('resultats_test')
    .whereNull('date_realisation')
    .update({ date_realisation: new Date('2025-03-19T00:00:00.000Z') }); // Date d'ajout de la propriété

  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropNullable('date_realisation');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.setNullable('date_realisation');
  });
}
