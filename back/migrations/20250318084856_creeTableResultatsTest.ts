import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('resultats_test', (table) => {
    table.uuid('id');
    table.text('email_utilisateur');
    table.text('region');
    table.text('secteur');
    table.text('taille_organisation');
    table.jsonb('reponses');
    table.primary(['id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('resultats_test');
}
