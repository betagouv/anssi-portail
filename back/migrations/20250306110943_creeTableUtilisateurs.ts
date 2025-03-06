import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('utilisateurs', (table) => {
    table.text('email');
    table.primary(['email']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('utilisateurs');
}
