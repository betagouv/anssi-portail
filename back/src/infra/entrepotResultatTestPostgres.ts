import { EntrepotResultatTest } from '../metier/entrepotResultatTest';
import { ResultatTestMaturite } from '../metier/resultatTestMaturite';
import Knex from 'knex';
import config from '../../knexfile';
import { EntrepotUtilisateurMPAPostgres } from './entrepotUtilisateurMPAPostgres';
import { Utilisateur } from '../metier/utilisateur';
import { AdaptateurHachage } from './adaptateurHachage';

export class EntrepotResultatTestPostgres implements EntrepotResultatTest {
  knex: Knex.Knex;
  entrepotUtilisateur: EntrepotUtilisateurMPAPostgres;
  private adaptateurHachage: AdaptateurHachage;

  constructor({
    entrepotUtilisateur,
    adaptateurHachage,
  }: {
    entrepotUtilisateur: EntrepotUtilisateurMPAPostgres;
    adaptateurHachage: AdaptateurHachage;
  }) {
    this.adaptateurHachage = adaptateurHachage;
    this.knex = Knex(config);
    this.entrepotUtilisateur = entrepotUtilisateur;
  }

  async ceuxDeSessionGroupe(code: string): Promise<ResultatTestMaturite[]> {
    const donnees = await this.knex('resultats_test').where({
      code_session_groupe: code,
    });
    return Promise.all(
      donnees.map((donnees) => this.traduitEnResultatTestMaturite(donnees))
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async traduitEnResultatTestMaturite(donneesTestMaturite: any) {
    const utilisateur: Utilisateur | undefined =
      donneesTestMaturite.email_utilisateur_hache
        ? await this.entrepotUtilisateur.parEmailHache(
            donneesTestMaturite.email_utilisateur_hache
          )
        : undefined;

    return new ResultatTestMaturite({
      ...donneesTestMaturite,
      utilisateur,
      tailleOrganisation: donneesTestMaturite.taille_organisation,
      codeSessionGroupe: donneesTestMaturite.code_session_groupe,
    });
  }

  async parId(id: string): Promise<ResultatTestMaturite | undefined> {
    const donnees = await this.knex('resultats_test').where({ id }).first();
    return donnees ? this.traduitEnResultatTestMaturite(donnees) : undefined;
  }

  async dernierPourUtilisateur(
    utilisateur: Utilisateur
  ): Promise<ResultatTestMaturite | undefined> {
    const donnees = await this.knex('resultats_test')
      .where({ email_utilisateur_hache: this.adaptateurHachage.hache( utilisateur.email) })
      .orderBy('date_realisation', 'desc')
      .first();
    return donnees ? this.traduitEnResultatTestMaturite(donnees) : undefined;
  }

  async metsAjour(resultatTest: ResultatTestMaturite): Promise<void> {
    await this.knex('resultats_test')
      .where({ id: resultatTest.id })
      .update({
        email_utilisateur: resultatTest.utilisateur?.email,
        email_utilisateur_hache: resultatTest.utilisateur
          ? this.adaptateurHachage.hache(resultatTest.utilisateur.email)
          : null,
      });
  }

  async ajoute(resultatTest: ResultatTestMaturite): Promise<void> {
    const { utilisateur, tailleOrganisation, codeSessionGroupe, ...reste } =
      resultatTest;
    await this.knex('resultats_test').insert({
      ...reste,
      email_utilisateur: utilisateur?.email,
      taille_organisation: tailleOrganisation,
      code_session_groupe: codeSessionGroupe,
      email_utilisateur_hache: resultatTest.utilisateur
        ? this.adaptateurHachage.hache(resultatTest.utilisateur.email)
        : null,
    });
  }
}
