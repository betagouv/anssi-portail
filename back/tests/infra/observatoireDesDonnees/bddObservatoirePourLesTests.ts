import Knex from 'knex';
import ClientPgLite from 'knex-pglite';

// Le schéma réel de la base de l'observatoire est géré par les migrations Knex
// du dépôt `lab-anssi-donnees-observatoire` (migrations `20261119140*` et `20261125100*`).
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

  await knex.schema.createSchema('msc');
  await knex.schema
    .withSchema('msc')
    .createTable('executions', (table) => {
      table.timestamp('date_execution', { useTz: true }).notNullable();
    })
    .createTable('utilisateurs', (table) => {
      table.string('id_hash').primary();
      table.string('region');
      table.string('departement');
      table.string('secteur_activite');
      table.string('type_organisation');
      table.string('taille_organisation');
    })
    .createTable('tests_realises', (table) => {
      table.string('id_hash').primary();
      table.string('type_test').notNullable();
      table.date('date_realisation');
      table.string('niveau');
      table.string('id_hash_utilisateur').references('id_hash').inTable('msc.utilisateurs').onDelete('CASCADE');
      table.string('region_declaree');
      table.string('secteur_activite_declare');
      table.string('taille_organisation_declaree');
    })
    .createTable('parcours_rejoints', (table) => {
      table
        .string('id_hash_utilisateur')
        .primary()
        .references('id_hash')
        .inTable('msc.utilisateurs')
        .onDelete('CASCADE');
      table.date('date');
    })
    .createTable('badges_cyberdepart', (table) => {
      table
        .string('id_hash_utilisateur')
        .primary()
        .references('id_hash')
        .inTable('msc.utilisateurs')
        .onDelete('CASCADE');
      table.date('date');
    })
    .createTable('completions_parcours', (table) => {
      table
        .string('id_hash_utilisateur')
        .notNullable()
        .references('id_hash')
        .inTable('msc.utilisateurs')
        .onDelete('CASCADE');
      table.integer('seuil').notNullable().checkIn(['50', '80', '100']);
      table.date('date');
      table.primary(['id_hash_utilisateur', 'seuil']);
    });

  return knex;
};
