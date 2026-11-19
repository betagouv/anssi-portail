import type { Knex } from 'knex';

const contrainteTypeTest = 'resultats_test_type_test_valide';
const contrainteScoreHameçonnage = 'resultats_test_score_hameconnage_obligatoire';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropChecks(contrainteTypeTest);
    table.check("type_test in ('maturité cyber', 'vrai-faux', 'hameçonnage')", undefined, contrainteTypeTest);
    table.check("type_test <> 'hameçonnage' or score is not null", undefined, contrainteScoreHameçonnage);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropChecks(contrainteScoreHameçonnage);
    table.dropChecks(contrainteTypeTest);
    table.check("type_test in ('maturité cyber', 'vrai-faux')", undefined, contrainteTypeTest);
  });
}
