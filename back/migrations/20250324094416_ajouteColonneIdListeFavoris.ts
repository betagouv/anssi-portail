import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.uuid('id_liste_favoris').defaultTo(knex.fn.uuid());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.dropColumn('id_liste_favoris');
  });
}
