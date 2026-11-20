import { Knex } from 'knex';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AdaptateurObservatoirePostgres } from '../../../src/infra/observatoireDesDonnees/adaptateurObservatoirePostgres.js';
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

  describe('concernant le total des services', () => {
    it('compte tous les services en l’absence de filtre', async () => {
      await trx('mss.services_crees').insert([{ id_hash: 'service-1' }, { id_hash: 'service-2' }]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const total = await adaptateur.totalServices({});

      expect(total).toBe(2);
    });

    it('ne compte que les services de la région filtrée', async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-breton', region: 'FR-BRE' },
        { id_hash: 'service-normand', region: 'FR-NOR' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const total = await adaptateur.totalServices({ region: 'FR-BRE' });

      expect(total).toBe(1);
    });

    it('ne compte que les services du département filtré', async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-finistérien', departement: '29' },
        { id_hash: 'service-morbihannais', departement: '56' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const total = await adaptateur.totalServices({ departement: '29' });

      expect(total).toBe(1);
    });
  });
});
