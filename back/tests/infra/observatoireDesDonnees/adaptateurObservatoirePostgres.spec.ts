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
    it("compte tous les services en l'absence de filtre", async () => {
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

    it("ne compte que les services du secteur d'activité filtré", async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-santé', secteur_activite: 'sante' },
        { id_hash: 'service-énergie', secteur_activite: 'energie' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const total = await adaptateur.totalServices({ secteurActivite: 'sante' });

      expect(total).toBe(1);
    });

    it("ne compte que les services du type d'organisation filtré", async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-d-une-commune', type_organisation: 'commune' },
        { id_hash: 'service-d-un-ministère', type_organisation: 'ministere' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const total = await adaptateur.totalServices({ typeOrganisation: 'commune' });

      expect(total).toBe(1);
    });
  });

  describe('concernant le cumul mensuel des services', () => {
    it('cumule les services créés mois par mois', async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-1', date_creation: '2026-01-05' },
        { id_hash: 'service-2', date_creation: '2026-01-20' },
        { id_hash: 'service-3', date_creation: '2026-02-10' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const cumul = await adaptateur.cumulMensuelServices({});

      expect(cumul).toStrictEqual([
        { mois: '2026-01', cumul: 2 },
        { mois: '2026-02', cumul: 3 },
      ]);
    });

    it('inclut les mois sans création', async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-de-janvier', date_creation: '2026-01-05' },
        { id_hash: 'service-de-mars', date_creation: '2026-03-10' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const cumul = await adaptateur.cumulMensuelServices({});

      expect(cumul).toStrictEqual([
        { mois: '2026-01', cumul: 1 },
        { mois: '2026-02', cumul: 1 },
        { mois: '2026-03', cumul: 2 },
      ]);
    });

    it('applique les filtres', async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-breton', date_creation: '2026-01-05', region: 'FR-BRE' },
        { id_hash: 'service-normand', date_creation: '2026-01-20', region: 'FR-NOR' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const cumul = await adaptateur.cumulMensuelServices({ region: 'FR-BRE' });

      expect(cumul).toStrictEqual([{ mois: '2026-01', cumul: 1 }]);
    });
  });

  describe('concernant les mesures faites par mois', () => {
    it("rattache les mesures au mois précédent leur date, parce que la synchronisation tourne en début de mois et enregistre l'état du mois écoulé", async () => {
      await trx('mss.services_crees').insert({ id_hash: 'un-service' });
      await trx('mss.mesures_faites').insert({ id_hash_service: 'un-service', date: '2026-03-01', total_faites: 4 });
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const mesures = await adaptateur.mesuresFaitesParMois({});

      expect(mesures).toStrictEqual([{ mois: '2026-02', total: 4 }]);
    });

    it('additionne les mesures de tous les services pour un même mois', async () => {
      await trx('mss.services_crees').insert([{ id_hash: 'service-1' }, { id_hash: 'service-2' }]);
      await trx('mss.mesures_faites').insert([
        { id_hash_service: 'service-1', date: '2026-03-01', total_faites: 4 },
        { id_hash_service: 'service-2', date: '2026-03-01', total_faites: 3 },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const mesures = await adaptateur.mesuresFaitesParMois({});

      expect(mesures).toStrictEqual([{ mois: '2026-02', total: 7 }]);
    });

    it('applique les filtres', async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-breton', region: 'FR-BRE' },
        { id_hash: 'service-normand', region: 'FR-NOR' },
      ]);
      await trx('mss.mesures_faites').insert([
        { id_hash_service: 'service-breton', date: '2026-03-01', total_faites: 4 },
        { id_hash_service: 'service-normand', date: '2026-03-01', total_faites: 3 },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const mesures = await adaptateur.mesuresFaitesParMois({ region: 'FR-BRE' });

      expect(mesures).toStrictEqual([{ mois: '2026-02', total: 4 }]);
    });
  });

  describe('concernant les services par niveau de sécurité', () => {
    it('compte les services par niveau de sécurité', async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-1', niveau_securite: 'Modérés' },
        { id_hash: 'service-2', niveau_securite: 'Modérés' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const services = await adaptateur.servicesParNiveauSecurite({});

      expect(services).toStrictEqual([{ niveauSecurite: 'Modérés', total: 2 }]);
    });

    it("trie les niveaux dans l'ordre Élémentaires, Modérés, Importants", async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-important', niveau_securite: 'Importants' },
        { id_hash: 'service-modéré', niveau_securite: 'Modérés' },
        { id_hash: 'service-élémentaire', niveau_securite: 'Élémentaires' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const services = await adaptateur.servicesParNiveauSecurite({});

      expect(services.map(({ niveauSecurite }) => niveauSecurite)).toStrictEqual([
        'Élémentaires',
        'Modérés',
        'Importants',
      ]);
    });

    it('ignore les services sans niveau de sécurité', async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-modéré', niveau_securite: 'Modérés' },
        { id_hash: 'service-sans-niveau', niveau_securite: null },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const services = await adaptateur.servicesParNiveauSecurite({});

      expect(services).toStrictEqual([{ niveauSecurite: 'Modérés', total: 1 }]);
    });

    it('applique les filtres', async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-breton', niveau_securite: 'Modérés', region: 'FR-BRE' },
        { id_hash: 'service-normand', niveau_securite: 'Modérés', region: 'FR-NOR' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const services = await adaptateur.servicesParNiveauSecurite({ region: 'FR-BRE' });

      expect(services).toStrictEqual([{ niveauSecurite: 'Modérés', total: 1 }]);
    });
  });

  describe('concernant le cumul mensuel des homologations', () => {
    it("rattache les homologations au mois précédent leur date, parce que la synchronisation tourne en début de mois et enregistre l'état du mois écoulé", async () => {
      await trx('mss.services_crees').insert({ id_hash: 'un-service' });
      await trx('mss.homologations_realisees').insert({
        id_hash_service: 'un-service',
        date: '2026-03-01',
        total_realisees: 2,
      });
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const homologations = await adaptateur.cumulMensuelHomologations({});

      expect(homologations).toStrictEqual([{ mois: '2026-02', cumul: 2 }]);
    });

    it('additionne les cumuls de tous les services pour un même mois, parce que la synchronisation enregistre déjà un total cumulé par service', async () => {
      await trx('mss.services_crees').insert([{ id_hash: 'service-1' }, { id_hash: 'service-2' }]);
      await trx('mss.homologations_realisees').insert([
        { id_hash_service: 'service-1', date: '2026-03-01', total_realisees: 2 },
        { id_hash_service: 'service-2', date: '2026-03-01', total_realisees: 3 },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const homologations = await adaptateur.cumulMensuelHomologations({});

      expect(homologations).toStrictEqual([{ mois: '2026-02', cumul: 5 }]);
    });

    it('applique les filtres', async () => {
      await trx('mss.services_crees').insert([
        { id_hash: 'service-breton', region: 'FR-BRE' },
        { id_hash: 'service-normand', region: 'FR-NOR' },
      ]);
      await trx('mss.homologations_realisees').insert([
        { id_hash_service: 'service-breton', date: '2026-03-01', total_realisees: 2 },
        { id_hash_service: 'service-normand', date: '2026-03-01', total_realisees: 3 },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const homologations = await adaptateur.cumulMensuelHomologations({ region: 'FR-BRE' });

      expect(homologations).toStrictEqual([{ mois: '2026-02', cumul: 2 }]);
    });
  });

  describe('concernant la date de dernière exécution de la synchronisation', () => {
    it('renvoie la date la plus récente', async () => {
      await trx('mss.executions').insert([
        { date_execution: '2026-02-01T03:00:00Z' },
        { date_execution: '2026-03-01T03:00:00Z' },
      ]);
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const date = await adaptateur.dateDerniereExecution();

      expect(date).toStrictEqual(new Date('2026-03-01T03:00:00Z'));
    });

    it("renvoie null quand la synchronisation ne s'est jamais exécutée", async () => {
      const adaptateur = new AdaptateurObservatoirePostgres(trx);

      const date = await adaptateur.dateDerniereExecution();

      expect(date).toBeNull();
    });
  });
});
