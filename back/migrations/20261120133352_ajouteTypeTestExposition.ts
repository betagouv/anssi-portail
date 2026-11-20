import type { Knex } from 'knex';

const contrainteTypeTest = 'resultats_test_type_test_valide';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropChecks(contrainteTypeTest);
    table.check(
      "type_test in ('maturité cyber', 'vrai-faux', 'hameçonnage', 'exposition')",
      undefined,
      contrainteTypeTest
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropChecks(contrainteTypeTest);
    table.check("type_test in ('maturité cyber', 'vrai-faux', 'hameçonnage')", undefined, contrainteTypeTest);
  });
}
