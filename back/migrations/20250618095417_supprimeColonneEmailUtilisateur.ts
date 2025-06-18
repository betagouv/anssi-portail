import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.dropColumn('email');
    table.primary(['email_hache']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.dropPrimary('utilisateurs_pkey');
    table.string('email');
  });
  await knex.raw("update utilisateurs set email=donnees->>'email'")
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.primary(['email']);
  });
}
