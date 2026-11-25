import { Knex } from 'knex';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AdaptateurObservatoireMSCPostgres } from '../../../src/infra/observatoireDesDonnees/adaptateurObservatoireMSCPostgres.js';
import { creeBddObservatoirePourLesTests } from './bddObservatoirePourLesTests.js';

describe("L'adaptateur PostgreSQL de l'observatoire des données de MSC", () => {
  let knex: Knex;
  let trx: Knex.Transaction;

  const desTests = (tests: { type_test: string; niveau: string | null }[]) =>
    trx('msc.tests_realises').insert(tests.map((test, index) => ({ id_hash: `test-${index}`, ...test })));

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

  it('compte uniquement les tests de maturité', async () => {
    await desTests([
      { type_test: 'maturité cyber', niveau: 'Émergent' },
      { type_test: 'maturité cyber', niveau: null },
      { type_test: 'hameçonnage', niveau: null },
    ]);

    const total = await new AdaptateurObservatoireMSCPostgres(trx).totalTestsMaturite();

    expect(total).toBe(2);
  });

  it('répartit les tests de maturité par niveau, du plus faible au plus élevé', async () => {
    await desTests([
      { type_test: 'maturité cyber', niveau: 'Optimal' },
      { type_test: 'maturité cyber', niveau: 'Émergent' },
      { type_test: 'maturité cyber', niveau: 'Insuffisant' },
      { type_test: 'maturité cyber', niveau: 'Émergent' },
      { type_test: 'maturité cyber', niveau: null },
      { type_test: 'vrai-faux', niveau: 'Optimal' },
    ]);

    const parNiveau = await new AdaptateurObservatoireMSCPostgres(trx).testsMaturiteParNiveau();

    expect(parNiveau).toStrictEqual([
      { niveau: 'Insuffisant', total: 1 },
      { niveau: 'Émergent', total: 2 },
      { niveau: 'Optimal', total: 1 },
    ]);
  });

  it('renvoie la date de la dernière exécution de la mise à jour', async () => {
    await trx('msc.executions').insert([
      { date_execution: new Date('2026-11-24T02:30:00.000Z') },
      { date_execution: new Date('2026-11-25T02:30:00.000Z') },
    ]);

    const date = await new AdaptateurObservatoireMSCPostgres(trx).dateDerniereExecution();

    expect(date).toStrictEqual(new Date('2026-11-25T02:30:00.000Z'));
  });

  it("renvoie null lorsque la mise à jour n'a jamais été exécutée", async () => {
    const date = await new AdaptateurObservatoireMSCPostgres(trx).dateDerniereExecution();

    expect(date).toBeNull();
  });
});
