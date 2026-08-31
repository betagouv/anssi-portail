import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('mesures').where('id', 'RH.1').update({
    action_facile_a_faire: ``,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures').where('id', 'RH.1').update({
    action_facile_a_faire: `https://lab-anssi-docs.cleverapps.io/doc/rh1-yk47WjNHgS`,
  });
}
