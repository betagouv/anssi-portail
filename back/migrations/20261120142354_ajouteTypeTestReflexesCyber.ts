import type { Knex } from 'knex';

const contrainteTypeTest = 'resultats_test_type_test_valide';
const contrainteScoreRéflexesCyber = 'resultats_test_score_reflexes_cyber_obligatoire';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropChecks(contrainteTypeTest);
    table.check(
      "type_test in ('maturité cyber', 'vrai-faux', 'hameçonnage', 'exposition', 'réflexes cyber')",
      undefined,
      contrainteTypeTest
    );
    table.check("type_test <> 'réflexes cyber' or score is not null", undefined, contrainteScoreRéflexesCyber);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropChecks(contrainteScoreRéflexesCyber);
    table.dropChecks(contrainteTypeTest);
    table.check(
      "type_test in ('maturité cyber', 'vrai-faux', 'hameçonnage', 'exposition')",
      undefined,
      contrainteTypeTest
    );
  });
}
