import { createHmac } from 'node:crypto';
import type { Knex } from 'knex';

const hacheAvecHMAC = (valeur: string) => {
  if (!process.env.HACHAGE_SECRET_DE_HACHAGE_1) {
    throw new Error('Missing HACHAGE_SECRET_DE_HACHAGE_1');
  }

  return createHmac('sha256', process.env.HACHAGE_SECRET_DE_HACHAGE_1)
    .update(valeur)
    .digest('hex');
};

exports.up = async (knex: Knex) => {
  async function migreLaTable(
    trx: Knex.Transaction,
    table: string
  ) {
    const lignes = await trx(table);

    const emailsDistincts = new Set(
      lignes
        .map(({ email_utilisateur: email }) => email)
        .filter((email) => !!email)
    );

    return emailsDistincts.values().map((email) => {
      const emailHacheHMAC = `v1:${hacheAvecHMAC(email)}`;
      return trx(table)
        .where({ email_utilisateur: email })
        .update({ email_utilisateur_hache: emailHacheHMAC });
    });
  }

  await knex.transaction(async (trx) => {
    const majFavoris = await migreLaTable(trx, 'favoris');
    const majResultatsTest = await migreLaTable(trx, 'resultats_test');

    await Promise.all([...majFavoris, ...majResultatsTest]);
  });
};

exports.down = async (knex: Knex) => {
  await knex.transaction(async (trx) => {
    return Promise.all([
      trx('favoris').update({ email_utilisateur_hache: null }),
      trx('resultats_test').update({ email_utilisateur_hache: null }),
    ]);
  });
};
