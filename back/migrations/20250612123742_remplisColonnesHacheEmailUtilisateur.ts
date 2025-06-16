import {createHmac} from "node:crypto";
import {createHash} from "crypto";
import type { Knex } from 'knex';

const hacheAvecHMAC = (valeur: string) => {
  if (!process.env.HACHAGE_SECRET_DE_HACHAGE_1) {
    throw new Error("Missing HACHAGE_SECRET_DE_HACHAGE_1");
  }

  return createHmac('sha256', process.env.HACHAGE_SECRET_DE_HACHAGE_1)
    .update(valeur)
    .digest('hex');
};

const hacheSha256 = (valeur: string) =>
  createHash('sha256')
  .update(valeur + process.env.CHIFFREMENT_SEL_DE_HASHAGE)
  .digest('hex');

export async function up(knex: Knex): Promise<void> {

  await knex.transaction(async (trx) => {
    const utilisateurs = await trx('utilisateurs');

    const maj = utilisateurs.map(({ email }) => {

      const emailHache256 = hacheSha256(email);
      const emailHacheHMAC = `v1:${hacheAvecHMAC(email)}`;

      return trx('utilisateurs').where({ email }).update({ email_hache: emailHacheHMAC, email_hache_256: emailHache256 });
    });

    await Promise.all(maj);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) =>
    trx('utilisateurs').update({ email_hache: null, email_hache_256: null })
  );
}
