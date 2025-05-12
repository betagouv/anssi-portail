import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sessions_groupe', (table) => {
    table.text('code');
    table.datetime('date_creation').defaultTo(knex.fn.now());
    table.primary(['code']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('sessions_groupe');
}
