import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('favoris').where('id_item_cyber', '/services/mon-espace-nis2').delete();
}

export async function down(_knex: Knex): Promise<void> {}
