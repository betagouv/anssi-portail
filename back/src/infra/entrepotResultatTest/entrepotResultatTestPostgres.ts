import Knex from 'knex';
import type { EntrepotUtilisateur } from '@metier/entrepotUtilisateur.js';
import type { EntrepôtRésultatTest } from '@metier/mini-tests/resultat-test/entrepotResultatTest.js';
import type { RésultatTest } from '@metier/mini-tests/resultat-test/resultatTest.js';
import type { Utilisateur } from '@metier/utilisateur.js';
import config from '../../../knexfile.js';
import type { AdaptateurHachage } from '../adaptateurHachage.js';
import {
  estUneEntréeDuType,
  type EntréePostgresDuType,
  type EntréePostgresRésultatTest,
  type TypeTest,
} from './entreePostgresResultatTest.js';

export abstract class EntrepôtRésultatTestPostgres<
  Type extends TypeTest,
  Résultat extends RésultatTest,
> implements EntrepôtRésultatTest<Résultat> {
  protected readonly entrepotUtilisateur: EntrepotUtilisateur;
  protected readonly adaptateurHachage: AdaptateurHachage;

  protected readonly knex = Knex(config);

  protected abstract readonly typeTest: Type;
  protected abstract versRésultat(entrée: EntréePostgresDuType<Type>): Promise<Résultat>;
  protected abstract versEntrée(résultat: Résultat): EntréePostgresDuType<Type>;

  constructor({
    entrepotUtilisateur,
    adaptateurHachage,
  }: {
    entrepotUtilisateur: EntrepotUtilisateur;
    adaptateurHachage: AdaptateurHachage;
  }) {
    this.entrepotUtilisateur = entrepotUtilisateur;
    this.adaptateurHachage = adaptateurHachage;
  }

  protected tableRésultatsTest() {
    return this.knex<EntréePostgresRésultatTest>('resultats_test').where('type_test', this.typeTest);
  }

  protected entréeDuType(entrée: EntréePostgresRésultatTest): EntréePostgresDuType<Type> {
    if (!estUneEntréeDuType(entrée, this.typeTest)) {
      throw new Error(`Type de test inattendu pour le résultat ${entrée.id} : ${entrée.type_test}`);
    }
    return entrée;
  }

  protected async hydrate(entrée: EntréePostgresRésultatTest): Promise<Résultat> {
    return this.versRésultat(this.entréeDuType(entrée));
  }

  async parId(id: string): Promise<Résultat | undefined> {
    const entrée = await this.tableRésultatsTest().where({ id }).first();
    return entrée ? this.hydrate(entrée) : undefined;
  }

  async dernierPourUtilisateur(utilisateur: Utilisateur): Promise<Résultat | undefined> {
    const entrée = await this.tableRésultatsTest()
      .where({ email_utilisateur_hache: this.adaptateurHachage.hache(utilisateur.email) })
      .orderBy('date_realisation', 'desc')
      .first();
    return entrée ? this.hydrate(entrée) : undefined;
  }

  async pourUtilisateur(utilisateur: Utilisateur): Promise<Résultat[]> {
    const entrées = await this.tableRésultatsTest().where({
      email_utilisateur_hache: this.adaptateurHachage.hache(utilisateur.email),
    });
    return Promise.all(entrées.map((entrée) => this.hydrate(entrée)));
  }

  async metsÀjour(résultat: Résultat): Promise<void> {
    await this.tableRésultatsTest()
      .where({ id: résultat.id })
      .update({ email_utilisateur_hache: this.emailHaché(résultat.utilisateur) });
  }

  async ajoute(résultat: Résultat): Promise<void> {
    const entrée = this.versEntrée(résultat);
    await this.knex<EntréePostgresRésultatTest>('resultats_test').insert(entrée);
  }

  async taille(): Promise<number> {
    const [résultat] = await this.tableRésultatsTest().count({ count: '*' });
    return Number(résultat.count);
  }

  private emailHaché(utilisateur?: Utilisateur): string | null {
    return utilisateur ? this.adaptateurHachage.hache(utilisateur.email) : null;
  }
}
