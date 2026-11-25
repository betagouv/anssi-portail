import { tailleEntite, typeEntite } from '@lab-anssi/lib';
import type { Knex } from 'knex';
import pThrottle from 'p-throttle';
import type { AdaptateurChiffrement, ObjetChiffre } from '../infra/adaptateurChiffrement.js';
import type { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import type { AdaptateurProfilAnssi } from '../infra/adaptateurProfilAnssi.js';
import type { AdaptateurRechercheEntreprise, OrganisationDetaillee } from '../infra/adaptateurRechercheEntreprise.js';
import {
  RésultatTestMaturité,
  type ReponsesTestMaturite,
} from '../metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import { régions } from '../metier/referentielRegions.js';

const TABLE_EXECUTIONS = 'msc.executions';
const TABLE_UTILISATEURS = 'msc.utilisateurs';
const TABLE_TESTS = 'msc.tests_realises';
const TABLE_EVENEMENTS = 'journal_msc.evenements';

const INTERVALLE_APPELS_RECHERCHE_ENTREPRISE_EN_MS = Math.ceil(1000 / 7);
const TAILLE_LOT_PROFILS_ANSSI = 500;
const TAILLE_PAQUET_ECRITURE = 1000;
const UN_JOUR_EN_MS = 24 * 60 * 60 * 1000;

type ÉvénementTestRevendiqué = {
  donnees: { idResultatTest?: string; idUtilisateur?: string };
};

type ProfilUtilisateur = {
  region: string | null;
  departement: string | null;
  secteur_activite: string | null;
  type_organisation: string | null;
  taille_organisation: string | null;
};

const PROFIL_VIDE: ProfilUtilisateur = {
  region: null,
  departement: null,
  secteur_activite: null,
  type_organisation: null,
  taille_organisation: null,
};

const aUnProfil = (profil: ProfilUtilisateur) =>
  (Object.keys(PROFIL_VIDE) as (keyof ProfilUtilisateur)[]).some((colonne) => profil[colonne] !== null);

const profilDe = (organisation: OrganisationDetaillee | undefined): ProfilUtilisateur =>
  organisation
    ? {
        region: organisation.region,
        departement: organisation.departement,
        secteur_activite: organisation.sectionActivitePrincipale,
        type_organisation: typeEntite(organisation),
        taille_organisation: tailleEntite(organisation),
      }
    : PROFIL_VIDE;

const versJour = (date: Date) => date.toISOString().slice(0, 10);

const régionInseeDepuisIso = (codeIso: string | null | undefined) =>
  régions.find((région) => région.codeIso === codeIso)?.codeINSEE.padStart(2, '0') ?? null;

const tailleDepuisTranche = (codeTrancheEffectif: string | null | undefined) =>
  codeTrancheEffectif
    ? tailleEntite({ natureJuridique: null, categorieEntreprise: null, trancheEffectifSalarie: codeTrancheEffectif })
    : null;

const enLots = <T>(éléments: T[], taille: number): T[][] =>
  Array.from({ length: Math.ceil(éléments.length / taille) }, (_, index) =>
    éléments.slice(index * taille, (index + 1) * taille)
  );

export class MiseAJourObservatoire {
  private readonly knexObservatoire: Knex;
  private readonly knexMSC: Knex;
  private readonly knexJournal: Knex;
  private readonly adaptateurChiffrement: AdaptateurChiffrement;
  private readonly adaptateurHachage: AdaptateurHachage;
  private readonly adaptateurProfilAnssi: AdaptateurProfilAnssi;
  private readonly adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;

  constructor({
    knexObservatoire,
    knexMSC,
    knexJournal,
    adaptateurChiffrement,
    adaptateurHachage,
    adaptateurProfilAnssi,
    adaptateurRechercheEntreprise,
  }: {
    knexObservatoire: Knex;
    knexMSC: Knex;
    knexJournal: Knex;
    adaptateurChiffrement: AdaptateurChiffrement;
    adaptateurHachage: AdaptateurHachage;
    adaptateurProfilAnssi: AdaptateurProfilAnssi;
    adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  }) {
    this.knexObservatoire = knexObservatoire;
    this.knexMSC = knexMSC;
    this.knexJournal = knexJournal;
    this.adaptateurChiffrement = adaptateurChiffrement;
    this.adaptateurHachage = adaptateurHachage;
    this.adaptateurProfilAnssi = adaptateurProfilAnssi;
    this.adaptateurRechercheEntreprise = adaptateurRechercheEntreprise;
  }

  async execute(): Promise<string[]> {
    const trace: string[] = [];
    const dateExecution = new Date();
    const derniereExecution = await this.dateDerniereExecution();
    const debut = derniereExecution ? new Date(derniereExecution.getTime() - UN_JOUR_EN_MS) : undefined;
    trace.push(
      derniereExecution
        ? `📅 Dernière exécution réussie : ${derniereExecution.toISOString()}, reprise au ${debut!.toISOString()}`
        : '📅 Aucune exécution précédente : calcul complet'
    );

    const { traités, avecProfil } = await this.metsAJourUtilisateurs();
    trace.push(`👤 ${traités} utilisateur(s) sans profil traité(s), ${avecProfil} profil(s) trouvé(s)`);
    trace.push(`🧭 ${await this.metsAJourTestsMaturite(debut)} test(s) de maturité écrit(s)`);
    trace.push(`🔗 ${await this.rattacheTestsRevendiques(debut)} test(s) rattaché(s) à un compte`);

    await this.knexObservatoire(TABLE_EXECUTIONS).insert({ date_execution: dateExecution });
    return trace;
  }

  private async dateDerniereExecution(): Promise<Date | undefined> {
    const [{ derniere }] = await this.knexObservatoire(TABLE_EXECUTIONS).max('date_execution as derniere');
    return derniere ? new Date(derniere) : undefined;
  }

  private async metsAJourUtilisateurs() {
    const connus: (ProfilUtilisateur & { id_hash: string })[] = await this.knexObservatoire(TABLE_UTILISATEURS).select(
      'id_hash',
      'region',
      'departement',
      'secteur_activite',
      'type_organisation',
      'taille_organisation'
    );
    const idsAvecProfil = new Set(connus.filter(aUnProfil).map(({ id_hash: idHash }) => idHash));

    const utilisateursDeMSC: { email_hache: string; donnees: ObjetChiffre }[] = await this.knexMSC(
      'utilisateurs'
    ).select('email_hache', 'donnees');
    const emailParIdHash = new Map(
      utilisateursDeMSC
        .filter(({ email_hache: emailHaché }) => !idsAvecProfil.has(emailHaché))
        .map(({ email_hache: emailHaché, donnees }) => [
          emailHaché,
          this.adaptateurChiffrement.dechiffre<{ email: string }>(donnees).email.toLowerCase(),
        ])
    );

    const siretParEmail = await this.siretsDesProfilsAnssi([...emailParIdHash.values()]);
    const organisationParSiret = await this.recupereOrganisations([...new Set(siretParEmail.values())]);

    const lignes = [...emailParIdHash].map(([idHash, email]) => {
      const siret = siretParEmail.get(email);
      return { id_hash: idHash, ...profilDe(siret ? organisationParSiret.get(siret) : undefined) };
    });
    await this.ecrit(TABLE_UTILISATEURS, lignes, ['id_hash'], Object.keys(PROFIL_VIDE));

    return { traités: lignes.length, avecProfil: lignes.filter(aUnProfil).length };
  }

  private async siretsDesProfilsAnssi(emails: string[]): Promise<Map<string, string>> {
    const siretParEmail = new Map<string, string>();
    for (const lot of enLots(emails, TAILLE_LOT_PROFILS_ANSSI)) {
      const profils = await this.adaptateurProfilAnssi.recherche({ emails: lot });
      profils.forEach(({ email, organisation }) => {
        if (organisation?.siret) siretParEmail.set(email.toLowerCase(), organisation.siret);
      });
    }
    return siretParEmail;
  }

  private async recupereOrganisations(sirets: string[]): Promise<Map<string, OrganisationDetaillee | undefined>> {
    const recupereEnCadence = pThrottle({ limit: 1, interval: INTERVALLE_APPELS_RECHERCHE_ENTREPRISE_EN_MS })(
      (siret: string) => this.adaptateurRechercheEntreprise.rechercheOrganisationDetaillee(siret)
    );
    const organisations = await Promise.all(sirets.map((siret) => recupereEnCadence(siret)));
    return new Map(sirets.map((siret, index) => [siret, organisations[index]]));
  }

  private async metsAJourTestsMaturite(debut: Date | undefined): Promise<number> {
    const requete = this.knexMSC('resultats_test')
      .select(
        'id',
        'date_realisation',
        'email_utilisateur_hache',
        'region',
        'secteur',
        'taille_organisation',
        'reponses'
      )
      .where({ type_test: 'maturité cyber' });
    if (debut) requete.where('date_realisation', '>=', debut);
    const résultats: {
      id: string;
      date_realisation: Date;
      email_utilisateur_hache: string | null;
      region: string | null;
      secteur: string | null;
      taille_organisation: string | null;
      reponses: ReponsesTestMaturite | null;
    }[] = await requete;

    const lignes = résultats.map((résultat) => ({
      id_hash: this.adaptateurHachage.hache(résultat.id),
      type_test: 'maturité cyber',
      date_realisation: versJour(résultat.date_realisation),
      niveau: résultat.reponses
        ? new RésultatTestMaturité({
            region: undefined,
            secteur: undefined,
            tailleOrganisation: undefined,
            reponses: résultat.reponses,
          }).niveau()
        : null,
      id_hash_utilisateur: résultat.email_utilisateur_hache,
      region_declaree: régionInseeDepuisIso(résultat.region),
      secteur_activite_declare: résultat.secteur,
      taille_organisation_declaree: tailleDepuisTranche(résultat.taille_organisation),
    }));

    await this.ecrit(TABLE_TESTS, lignes, ['id_hash'], ['niveau', 'id_hash_utilisateur']);
    return lignes.length;
  }

  private async rattacheTestsRevendiques(debut: Date | undefined): Promise<number> {
    const événements = await this.testsRevendiques(debut);
    const rattachements = événements.flatMap(({ donnees: { idResultatTest, idUtilisateur } }) =>
      idResultatTest && idUtilisateur
        ? [{ idHashTest: this.adaptateurHachage.hache(idResultatTest), idUtilisateur }]
        : []
    );

    let nombreRattachés = 0;
    await this.knexObservatoire.transaction(async (trx) => {
      for (const { idHashTest, idUtilisateur } of rattachements) {
        nombreRattachés += await trx(TABLE_TESTS)
          .where({ id_hash: idHashTest })
          .update({ id_hash_utilisateur: idUtilisateur });
      }
    });
    return nombreRattachés;
  }

  private async testsRevendiques(debut: Date | undefined): Promise<ÉvénementTestRevendiqué[]> {
    const requete = this.knexJournal(TABLE_EVENEMENTS)
      .select('donnees')
      .where({ type: 'PROPRIETE_TEST_REVENDIQUEE' })
      .orderBy('date');
    if (debut) requete.where('date', '>=', debut);
    return requete;
  }

  private async ecrit(
    table: string,
    lignes: Record<string, unknown>[],
    colonnesConflit: string[],
    colonnesAMettreAJour: string[]
  ) {
    await this.knexObservatoire.transaction(async (trx) => {
      for (const paquet of enLots(lignes, TAILLE_PAQUET_ECRITURE)) {
        await trx(table).insert(paquet).onConflict(colonnesConflit).merge(colonnesAMettreAJour);
      }
    });
  }
}
