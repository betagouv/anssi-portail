import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('favoris', (table) => {
    table.text('id');
    table.text('email_utilisateur');
    table.datetime('date_ajout').defaultTo(knex.fn.now());
    table.primary(['id', 'email_utilisateur']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('favoris');
}
