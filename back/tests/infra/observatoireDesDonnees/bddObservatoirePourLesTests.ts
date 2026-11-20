import Knex from 'knex';
import ClientPgLite from 'knex-pglite';

// Le schéma réel de la base de l'observatoire est géré par les migrations Knex
// du dépôt `lab-anssi-donnees-observatoire` (migrations `20261119140*`).
// On le recopie ici volontairement pour ne pas dépendre de ce dépôt :
// toute évolution de ces migrations doit être reportée ici.
export const creeBddObservatoirePourLesTests = async () => {
  const knex = Knex({ client: ClientPgLite, dialect: 'postgres', connection: {} });

  await knex.schema.createSchema('mss');
  await knex.schema
    .withSchema('mss')
    .createTable('services_crees', (table) => {
      table.string('id_hash').primary();
      table.date('date_creation');
      table.string('niveau_securite');
      table.string('region');
      table.string('departement');
      table.string('secteur_activite');
      table.string('type_organisation');
    })
    .createTable('mesures_faites', (table) => {
      table.string('id_hash_service').references('id_hash').inTable('mss.services_crees').notNullable();
      table.integer('total_faites');
      table.date('date');
      table.unique(['id_hash_service', 'date']);
    })
    .createTable('homologations_realisees', (table) => {
      table.string('id_hash_service').references('id_hash').inTable('mss.services_crees').notNullable();
      table.integer('total_realisees');
      table.date('date');
      table.unique(['id_hash_service', 'date']);
    })
    .createTable('executions', (table) => {
      table.timestamp('date_execution', { useTz: true }).notNullable();
    });

  return knex;
};
