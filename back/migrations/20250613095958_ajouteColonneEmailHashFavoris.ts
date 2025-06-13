import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('favoris', (table) => {
    table.string('email_utilisateur_hache').index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('favoris', (table) => {
    table.dropColumn('email_utilisateur_hache');
  });
}
