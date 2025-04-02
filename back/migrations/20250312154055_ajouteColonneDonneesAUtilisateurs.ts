import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.jsonb('donnees');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.dropColumn('donnees');
  });
}
