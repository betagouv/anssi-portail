import { Knex } from 'knex';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { creeBddObservatoirePourLesTests } from './bddObservatoirePourLesTests.js';

describe("L'adaptateur de l'observatoire des données PostgreSQL", () => {
  let knex: Knex;
  let trx: Knex.Transaction;

  beforeAll(async () => {
    knex = await creeBddObservatoirePourLesTests();
  });

  beforeEach(async () => {
    trx = await knex.transaction();
  });

  afterEach(async () => {
    await trx.rollback();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('peut faire des tests sur une base PGSQL', async () => {
    await trx('mss.services_crees').insert({ id_hash: 'un-service', region: 'FR-BRE' });

    const services = await trx('mss.services_crees').select('id_hash', 'region');

    expect(services).toStrictEqual([{ id_hash: 'un-service', region: 'FR-BRE' }]);
  });
});
