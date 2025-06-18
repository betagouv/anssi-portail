import type { Knex } from 'knex';
import { createHash } from 'crypto';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.dropColumn('email_hache_256');
  });
}

const hacheSha256 = (valeur: string) =>
  createHash('sha256')
    .update(valeur + process.env.CHIFFREMENT_SEL_DE_HASHAGE)
    .digest('hex');

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('utilisateurs', (table) => {
    table.string('email_hache_256');
  });

  await knex.transaction(async (trx) => {
    const utilisateurs = await trx('utilisateurs');

    const maj = utilisateurs.map((utilisateur) => {
      const emailHache256 = hacheSha256(utilisateur.donnees.email);

      return trx('utilisateurs')
        .where({ email_hache: utilisateur.email_hache })
        .update({ email_hache_256: emailHache256 });
    });

    await Promise.all(maj);
  });
}
