import Knex from 'knex';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { fabriqueAdaptateurChiffrement } from '../../src/infra/adaptateurChiffrement.js';
import type { AdaptateurProfilAnssi, ProfilAnssi } from '../../src/infra/adaptateurProfilAnssi.js';
import type {
  AdaptateurRechercheEntreprise,
  OrganisationDetaillee,
} from '../../src/infra/adaptateurRechercheEntreprise.js';
import { MiseAJourObservatoire } from '../../src/taches/metsAJourObservatoire.js';
import { fauxAdaptateurHachage, fauxAdaptateurRechercheEntreprise } from '../api/fauxObjets.js';
import { creeBddObservatoirePourLesTests } from '../infra/observatoireDesDonnees/bddObservatoirePourLesTests.js';

const adaptateurChiffrement = fabriqueAdaptateurChiffrement('0'.repeat(64));
const hache = fauxAdaptateurHachage.hache;

const uneOrganisation = (surcharge: Partial<OrganisationDetaillee> = {}): OrganisationDetaillee => ({
  natureJuridique: '5710',
  categorieEntreprise: 'PME',
  trancheEffectifSalarie: '12',
  finances: null,
  complements: { collectiviteTerritoriale: null, estAssociation: false },
  sectionActivitePrincipale: 'J',
  departement: '35',
  region: '53',
  ...surcharge,
});

const unProfil = (email: string, siret: string): ProfilAnssi => ({
  email,
  prenom: '',
  nom: '',
  domainesSpecialite: [],
  organisation: { nom: '', siret, departement: null },
});

const ajouteTablesMSCEtJournal = async (knex: Knex.Knex) => {
  await knex.schema
    .createTable('utilisateurs', (table) => {
      table.string('email_hache').primary();
      table.jsonb('donnees');
    })
    .createTable('resultats_test', (table) => {
      table.string('id').primary();
      table.string('type_test');
      table.timestamp('date_realisation');
      table.string('email_utilisateur_hache');
      table.string('region');
      table.string('secteur');
      table.string('taille_organisation');
      table.jsonb('reponses');
    });
  await knex.schema.createSchema('journal_msc');
  await knex.schema.withSchema('journal_msc').createTable('evenements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('type');
    table.timestamp('date', { useTz: true });
    table.jsonb('donnees');
  });
};

describe("La tâche de mise à jour de l'observatoire MSC", () => {
  let knex: Knex.Knex;
  let trx: Knex.Knex.Transaction;
  let profilsAnssi: ProfilAnssi[];
  let organisations: Map<string, OrganisationDetaillee>;
  let adaptateurProfilAnssi: AdaptateurProfilAnssi;
  let adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;

  const tache = () =>
    new MiseAJourObservatoire({
      knexObservatoire: trx,
      knexMSC: trx,
      knexJournal: trx,
      adaptateurChiffrement,
      adaptateurHachage: fauxAdaptateurHachage,
      adaptateurProfilAnssi,
      adaptateurRechercheEntreprise,
    });

  const unUtilisateurDeMSC = (email: string) =>
    trx('utilisateurs').insert({ email_hache: hache(email), donnees: adaptateurChiffrement.chiffre({ email }) });

  const unEvenement = (type: string, date: string, donnees: Record<string, string>) =>
    trx('journal_msc.evenements').insert({ type, date, donnees });

  const uneExecutionPrecedente = (date: string) => trx('msc.executions').insert({ date_execution: date });

  const lignes = (table: string, colonnes: string[], tri: string[] = colonnes) =>
    trx(table)
      .select(colonnes.map((colonne) => trx.raw('??::text', [colonne])))
      .orderBy(tri.map((colonne) => `${table}.${colonne}`));

  beforeAll(async () => {
    knex = await creeBddObservatoirePourLesTests();
    await ajouteTablesMSCEtJournal(knex);
  });

  beforeEach(async () => {
    trx = await knex.transaction();
    profilsAnssi = [];
    organisations = new Map();
    adaptateurProfilAnssi = {
      metsAJour: async () => {},
      recupere: async () => undefined,
      recherche: async ({ emails }) => profilsAnssi.filter(({ email }) => emails.includes(email.toLowerCase())),
    };
    adaptateurRechercheEntreprise = {
      ...fauxAdaptateurRechercheEntreprise,
      rechercheOrganisationDetaillee: async (siret) => organisations.get(siret),
    };
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-25T02:30:00.000Z'));
  });

  afterEach(async () => {
    vi.useRealTimers();
    await trx.rollback();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe("concernant l'exécution", () => {
    it("enregistre la date d'exécution", async () => {
      await tache().execute();

      const executions = await trx('msc.executions').select('date_execution');
      expect(executions).toEqual([{ date_execution: new Date('2026-11-25T02:30:00.000Z') }]);
    });

    it("n'enregistre pas l'exécution si l'API Recherche Entreprise est en erreur", async () => {
      await unUtilisateurDeMSC('jeanne@example.com');
      profilsAnssi = [unProfil('jeanne@example.com', '12345678900011')];
      adaptateurRechercheEntreprise.rechercheOrganisationDetaillee = async () => {
        throw new Error('API indisponible');
      };

      await expect(tache().execute()).rejects.toThrow('API indisponible');

      expect(await trx('msc.executions').select()).toEqual([]);
    });
  });

  describe('concernant les utilisateurs', () => {
    it("publie le profil de l'organisation de chaque utilisateur", async () => {
      await unUtilisateurDeMSC('Jeanne@Example.com');
      profilsAnssi = [unProfil('jeanne@example.com', '12345678900011')];
      organisations.set('12345678900011', uneOrganisation());

      await tache().execute();

      expect(await trx('msc.utilisateurs').select()).toEqual([
        {
          id_hash: hache('Jeanne@Example.com'),
          region: '53',
          departement: '35',
          secteur_activite: 'J',
          type_organisation: 'entreprise',
          taille_organisation: 'PME',
        },
      ]);
    });

    it('publie un profil vide pour un utilisateur sans organisation connue', async () => {
      await unUtilisateurDeMSC('jeanne@example.com');

      await tache().execute();

      expect(await trx('msc.utilisateurs').select()).toEqual([
        {
          id_hash: hache('jeanne@example.com'),
          region: null,
          departement: null,
          secteur_activite: null,
          type_organisation: null,
          taille_organisation: null,
        },
      ]);
    });

    it("ne recherche qu'une fois une organisation partagée par plusieurs utilisateurs", async () => {
      await unUtilisateurDeMSC('jeanne@example.com');
      await unUtilisateurDeMSC('jean@example.com');
      profilsAnssi = [unProfil('jeanne@example.com', '12345678900011'), unProfil('jean@example.com', '12345678900011')];
      organisations.set('12345678900011', uneOrganisation());
      const recherche = vi.spyOn(adaptateurRechercheEntreprise, 'rechercheOrganisationDetaillee');

      await tache().execute();

      expect(recherche).toHaveBeenCalledTimes(1);
    });

    it("ne recherche plus le profil d'un utilisateur déjà publié et complet", async () => {
      await unUtilisateurDeMSC('jeanne@example.com');
      await trx('msc.utilisateurs').insert({ id_hash: hache('jeanne@example.com'), region: '11' });
      const recherche = vi.spyOn(adaptateurProfilAnssi, 'recherche');

      await tache().execute();

      expect(recherche).not.toHaveBeenCalled();
    });

    it("recherche à nouveau le profil d'un utilisateur publié avec un profil vide", async () => {
      await unUtilisateurDeMSC('jeanne@example.com');
      await trx('msc.utilisateurs').insert({ id_hash: hache('jeanne@example.com') });
      profilsAnssi = [unProfil('jeanne@example.com', '12345678900011')];
      organisations.set('12345678900011', uneOrganisation());

      await tache().execute();

      expect(await trx('msc.utilisateurs').select('region')).toEqual([{ region: '53' }]);
    });
  });

  describe('concernant les tests de maturité', () => {
    const unTestDeMaturite = (id: string, surcharge: Record<string, unknown> = {}) =>
      trx('resultats_test').insert({
        id,
        type_test: 'maturité cyber',
        date_realisation: '2026-11-20T10:00:00.000Z',
        reponses: {
          'prise-en-compte-risque': 3,
          pilotage: 3,
          budget: 3,
          'ressources-humaines': 3,
          'adoption-solutions': 3,
          posture: 3,
        },
        ...surcharge,
      });

    it('publie chaque test avec le libellé de son niveau et le profil déclaré', async () => {
      await unTestDeMaturite('test-1', { region: 'FR-BRE', secteur: 'J', taille_organisation: '11' });

      await tache().execute();

      expect(await trx('msc.tests_realises').select()).toEqual([
        {
          id_hash: hache('test-1'),
          type_test: 'maturité cyber',
          date_realisation: expect.anything(),
          niveau: 'Intermédiaire',
          id_hash_utilisateur: null,
          region_declaree: '53',
          secteur_activite_declare: 'J',
          taille_organisation_declaree: 'PME',
        },
      ]);
      expect(await lignes('msc.tests_realises', ['date_realisation'])).toEqual([{ date_realisation: '2026-11-20' }]);
    });

    it("convertit sur deux chiffres le code INSEE d'une région d'outre-mer", async () => {
      await unTestDeMaturite('test-1', { region: 'FR-971' });

      await tache().execute();

      expect(await trx('msc.tests_realises').select('region_declaree')).toEqual([{ region_declaree: '01' }]);
    });

    it("rattache le test à l'utilisateur", async () => {
      await unUtilisateurDeMSC('jeanne@example.com');
      await unTestDeMaturite('test-1', { email_utilisateur_hache: hache('jeanne@example.com') });

      await tache().execute();

      expect(await trx('msc.tests_realises').select('id_hash_utilisateur')).toEqual([
        { id_hash_utilisateur: hache('jeanne@example.com') },
      ]);
    });

    it('ne relit que les tests réalisés depuis la veille de la dernière exécution', async () => {
      await uneExecutionPrecedente('2026-11-24T02:30:00.000Z');
      await unTestDeMaturite('ancien', { date_realisation: '2026-11-23T02:29:00.000Z' });
      await unTestDeMaturite('recent', { date_realisation: '2026-11-23T02:31:00.000Z' });

      await tache().execute();

      expect(await trx('msc.tests_realises').select('id_hash')).toEqual([{ id_hash: hache('recent') }]);
    });

    it('rattache à son compte un test revendiqué après coup', async () => {
      await unUtilisateurDeMSC('jeanne@example.com');
      await unTestDeMaturite('test-1', { date_realisation: '2026-01-01T00:00:00.000Z' });
      await tache().execute();
      await unEvenement('PROPRIETE_TEST_REVENDIQUEE', '2026-11-25T03:00:00.000Z', {
        idResultatTest: 'test-1',
        idUtilisateur: hache('jeanne@example.com'),
      });
      vi.setSystemTime(new Date('2026-11-26T02:30:00.000Z'));

      await tache().execute();

      expect(await trx('msc.tests_realises').select('id_hash_utilisateur')).toEqual([
        { id_hash_utilisateur: hache('jeanne@example.com') },
      ]);
    });
  });
});
