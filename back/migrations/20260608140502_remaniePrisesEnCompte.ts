import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('prises_en_compte', (table) => {
    table.renameColumn('mesure_id', 'id_mesure');
    table.dropPrimary();
    table.dropColumn('id');
    table.primary(['email_utilisateur_hache', 'id_mesure']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('prises_en_compte', (table) => {
    table.dropPrimary();
    table.increments('id').primary().first();
    table.unique(['email_utilisateur_hache', 'id_mesure']);
    table.renameColumn('id_mesure', 'mesure_id');
  });
}
