import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('mesures')
    .where('id', 'AUTH.5')
    .update({
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Guide ANSSI — Recommandations relatives à l'authentification multifacteur et aux mots de passe",
            url: 'https://cyber.gouv.fr/publications/recommandations-relatives-lauthentification-multifacteur-et-aux-mots-de-passe',
          },
        ]),
      ]),
    });

  await knex('mesures')
    .where('id', 'CONTINU.1')
    .update({
      liens: knex.raw('?::jsonb', [
        JSON.stringify([
          {
            libelle: "Pour aller plus loin : Guide ANSSI SAUVEGARDE DES SYSTÈMES D'INFORMATION - Les Fondamentaux",
            url: 'https://messervices.cyber.gouv.fr/documents-guides/anssi_fondamentaux_sauvegarde_systemes_dinformation_v1.1.pdf',
          },
        ]),
      ]),
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex('mesures')
    .whereIn('id', ['AUTH.5', 'CONTINU.1'])
    .update({
      liens: knex.raw("'[]'::jsonb"),
    });
}
