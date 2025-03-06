import type { Knex } from 'knex';

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.BASE_DONNEES_URL_SERVEUR,
  pool: { min: 0, max: 10 },
  migrations: { tableName: 'knex_migrations' },
};

export default config;
