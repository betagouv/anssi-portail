import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('favoris', (table) => {
    table.renameColumn('id', 'id_item_cyber');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('favoris', (table) => {
    table.renameColumn('id_item_cyber', 'id');
  });
}
