import type { Knex } from 'knex';

exports.up = (knex: Knex) =>
  knex.schema.createTable('secrets_hachage', (table) => {
    table.integer('version');
    table.primary(['version']);
    table.text('empreinte');
    table.datetime('date_migration').defaultTo(knex.fn.now());
  });

exports.down = (knex: Knex) => knex.schema.dropTable('secrets_hachage');
