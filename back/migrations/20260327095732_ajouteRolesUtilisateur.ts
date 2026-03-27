import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.jsonb('roles').defaultTo(knex.raw("'[]'::jsonb"));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.dropColumn('roles');
  });
}
