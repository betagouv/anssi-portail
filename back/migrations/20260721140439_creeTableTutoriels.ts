import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tutoriels', (table) => {
    table.text('id_mesure');
    table.text('titre');
    table.text('description');
    table.jsonb('etapes');
    table.text('note');
    table.jsonb('aller_plus_loin');
    table.foreign('id_mesure').references('id').inTable('mesures');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tutoriels');
}
