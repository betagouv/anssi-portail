import type { Knex } from 'knex';

const contrainteEmailHaché = 'resultats_test_email_utilisateur_hache_obligatoire';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.check(
      "type_test not in ('vrai-faux', 'hameçonnage', 'exposition', 'réflexes cyber') or email_utilisateur_hache is not null",
      undefined,
      contrainteEmailHaché
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropChecks(contrainteEmailHaché);
  });
}
