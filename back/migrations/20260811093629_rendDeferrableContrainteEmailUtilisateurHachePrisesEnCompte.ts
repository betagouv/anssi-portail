import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE prises_en_compte
      ALTER CONSTRAINT prises_en_compte_email_utilisateur_hache_foreign
      DEFERRABLE INITIALLY IMMEDIATE
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE prises_en_compte
      ALTER CONSTRAINT prises_en_compte_email_utilisateur_hache_foreign
      NOT DEFERRABLE
  `);
}
