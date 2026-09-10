import type { Knex } from 'knex';

const mesures = [
  'AUTH.1',
  'AUTH.4',
  'COMPTE.1',
  'COMPTE.2',
  'COMPTE.5',
  'COMPTE.6',
  'COMPTE.4',
  'DROITS.3',
  'DROITS.4',
  'DROITS.2',
];
const lien = {
  libelle: 'Fiche pratique - Gestion des identités',
  url: 'https://messervices.cyber.gouv.fr/documents-guides/Fiche_Gestion-des-identites_Protection.pdf',
};

export async function up(knex: Knex): Promise<void> {
  await knex('mesures')
    .whereIn('id', mesures)
    .update({ liens: knex.raw('liens || ?::jsonb', [JSON.stringify([lien])]) });
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures')
    .whereIn('id', mesures)
    .whereRaw('liens @> ?::jsonb', [JSON.stringify([lien])])
    .update({
      liens: knex.raw(
        `liens - (
          SELECT max(position)::integer - 1
          FROM jsonb_array_elements(liens) WITH ORDINALITY AS elements(valeur, position)
          WHERE valeur = ?::jsonb
        )`,
        [JSON.stringify(lien)]
      ),
    });
}
