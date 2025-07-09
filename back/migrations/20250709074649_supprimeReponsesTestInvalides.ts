import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    const lignes = await trx('resultats_test');
    const promesses = lignes.map((ligne) => {
      if (
        !Number.isInteger(ligne.reponses.budget) ||
        !Number.isInteger(ligne.reponses.pilotage) ||
        !Number.isInteger(ligne.reponses.posture) ||
        !Number.isInteger(ligne.reponses['adoption-solutions']) ||
        !Number.isInteger(ligne.reponses['prise-en-compte-risque']) ||
        !Number.isInteger(ligne.reponses['ressources-humaines'])
      ) {
        return trx('resultats_test').where({ id: ligne.id }).delete();
      }
    });
    const suppressions = promesses.filter(p=>p!== undefined);
    console.log(`Suppression de ${suppressions.length} lignes`);
    return Promise.all(suppressions);
  });
}

export async function down(_knex: Knex): Promise<void> {
  // on ne souhaite pas rétablir des données corrompues qui ont été supprimées
}
