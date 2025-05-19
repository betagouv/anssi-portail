import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.string('code_session_groupe').index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropColumn('code_session_groupe');
  });
}
