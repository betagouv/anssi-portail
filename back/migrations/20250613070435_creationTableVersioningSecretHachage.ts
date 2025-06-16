import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('secrets_hachage', (table) => {
    table.integer('version');
    table.primary(['version']);
    table.text('empreinte');
    table.datetime('date_migration').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('secrets_hachage');
}
