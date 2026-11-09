import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('favoris')
    .where('id_item_cyber', '/ressources/malette-cyber')
    .update({ id_item_cyber: '/ressources/mallette-cyber' });
}
export async function down(knex: Knex): Promise<void> {
  await knex('favoris')
    .where('id_item_cyber', '/ressources/mallette-cyber')
    .update({ id_item_cyber: '/ressources/malette-cyber' });
}
