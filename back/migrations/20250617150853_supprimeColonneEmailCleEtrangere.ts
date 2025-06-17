import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropColumn('email_utilisateur');
  });
  await knex.schema.alterTable('favoris', (table) => {
    table.dropColumn('email_utilisateur');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.string('email_utilisateur_hache').index();
  });
  await knex.schema.alterTable('favoris', (table) => {
    table.string('email_utilisateur_hache').index();
  });
}
