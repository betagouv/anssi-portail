import type { Knex } from 'knex';

const contrainteTypeTest = 'resultats_test_type_test_valide';
const contrainteScoreVraiFaux = 'resultats_test_score_vrai_faux_obligatoire';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.string('score', 3);
    table.dropChecks(contrainteTypeTest);
    table.check("type_test in ('maturité cyber', 'vrai-faux')", undefined, contrainteTypeTest);
    table.check("type_test <> 'vrai-faux' or score is not null", undefined, contrainteScoreVraiFaux);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('resultats_test', (table) => {
    table.dropChecks(contrainteScoreVraiFaux);
    table.dropChecks(contrainteTypeTest);
    table.check("type_test in ('maturité cyber')", undefined, contrainteTypeTest);
    table.dropColumn('score');
  });
}
