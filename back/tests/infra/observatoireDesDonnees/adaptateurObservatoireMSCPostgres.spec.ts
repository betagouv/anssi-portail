import { Knex } from 'knex';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AdaptateurObservatoireMSCPostgres } from '../../../src/infra/observatoireDesDonnees/adaptateurObservatoireMSCPostgres.js';
import { creeBddObservatoirePourLesTests } from './bddObservatoirePourLesTests.js';

describe("L'adaptateur PostgreSQL de l'observatoire des données de MSC", () => {
  let knex: Knex;
  let trx: Knex.Transaction;

  const desTests = (tests: { type_test: string; niveau: string | null }[]) =>
    trx('msc.tests_realises').insert(tests.map((test, index) => ({ id_hash: `test-${index}`, ...test })));

  const desUtilisateurs = (nombre: number) =>
    trx('msc.utilisateurs').insert(Array.from({ length: nombre }, (_, index) => ({ id_hash: `utilisateur-${index}` })));

  const desDates = (table: string, dates: string[], colonnes: Record<string, unknown> = {}) =>
    trx(table).insert(dates.map((date, index) => ({ id_hash_utilisateur: `utilisateur-${index}`, date, ...colonnes })));

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

  describe('concernant les tests de sensibilisation', () => {
    it('compte les tests de tous les types, avec ou sans compte', async () => {
      await desUtilisateurs(1);
      await trx('msc.tests_realises').insert([
        { id_hash: 'test-1', type_test: 'maturité cyber', id_hash_utilisateur: 'utilisateur-0' },
        { id_hash: 'test-2', type_test: 'hameçonnage' },
      ]);

      const total = await new AdaptateurObservatoireMSCPostgres(trx).totalTestsSensibilisation();

      expect(total).toBe(2);
    });

    it('les cumule mois par mois, y compris les mois sans test', async () => {
      await trx('msc.tests_realises').insert([
        { id_hash: 'test-1', type_test: 'maturité cyber', date_realisation: '2026-01-31' },
        { id_hash: 'test-2', type_test: 'vrai-faux', date_realisation: '2026-01-01' },
        { id_hash: 'test-3', type_test: 'exposition', date_realisation: '2026-03-01' },
      ]);

      const cumul = await new AdaptateurObservatoireMSCPostgres(trx).cumulMensuelTestsSensibilisation();

      expect(cumul).toStrictEqual([
        { mois: '2026-01', cumul: 2 },
        { mois: '2026-02', cumul: 2 },
        { mois: '2026-03', cumul: 3 },
      ]);
    });

    it("renvoie un cumul vide en l'absence de test", async () => {
      const cumul = await new AdaptateurObservatoireMSCPostgres(trx).cumulMensuelTestsSensibilisation();

      expect(cumul).toStrictEqual([]);
    });
  });

  it('compte les parcours rejoints', async () => {
    await desUtilisateurs(2);
    await desDates('msc.parcours_rejoints', ['2026-01-01', '2026-02-01']);

    const total = await new AdaptateurObservatoireMSCPostgres(trx).totalParcoursRejoints();

    expect(total).toBe(2);
  });

  describe('concernant les niveaux Cyberdépart validés', () => {
    beforeEach(async () => {
      await desUtilisateurs(3);
      await desDates('msc.badges_cyberdepart', ['2026-01-01', '2026-01-31', '2026-02-01']);
    });

    it('les compte', async () => {
      const total = await new AdaptateurObservatoireMSCPostgres(trx).totalCyberdepartsValides();

      expect(total).toBe(3);
    });

    it('les cumule mois par mois', async () => {
      const cumul = await new AdaptateurObservatoireMSCPostgres(trx).cumulMensuelCyberdepartsValides();

      expect(cumul).toStrictEqual([
        { mois: '2026-01', cumul: 2 },
        { mois: '2026-02', cumul: 3 },
      ]);
    });
  });

  describe('concernant les complétions du parcours', () => {
    beforeEach(async () => {
      await desUtilisateurs(2);
      await desDates('msc.completions_parcours', ['2026-01-01', '2026-02-01'], { seuil: 50 });
      await desDates('msc.completions_parcours', ['2026-03-01'], { seuil: 80 });
    });

    it('ne compte que celles du seuil demandé', async () => {
      const adaptateur = new AdaptateurObservatoireMSCPostgres(trx);

      expect(await adaptateur.totalCompletions(50)).toBe(2);
      expect(await adaptateur.totalCompletions(80)).toBe(1);
      expect(await adaptateur.totalCompletions(100)).toBe(0);
    });

    it('ne cumule mois par mois que celles du seuil demandé', async () => {
      const cumul = await new AdaptateurObservatoireMSCPostgres(trx).cumulMensuelCompletions(50);

      expect(cumul).toStrictEqual([
        { mois: '2026-01', cumul: 1 },
        { mois: '2026-02', cumul: 2 },
      ]);
    });
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
