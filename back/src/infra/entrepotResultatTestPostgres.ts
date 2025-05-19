import { EntrepotResultatTest } from '../metier/entrepotResultatTest';
import { ResultatTestMaturite } from '../metier/resultatTestMaturite';
import Knex from 'knex';
import config from '../../knexfile';

export class EntrepotResultatTestPostgres implements EntrepotResultatTest {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async ceuxDeSessionGroupe(code: string): Promise<ResultatTestMaturite[]> {
    const donnees = await this.knex('resultats_test').where({
      code_session_groupe: code,
    });
    return donnees.map(this.traduitEnResultatTestMaturite);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private traduitEnResultatTestMaturite(donneesTestMaturite: any) {
    return new ResultatTestMaturite({
      ...donneesTestMaturite,
      emailUtilisateur: donneesTestMaturite.email_utilisateur,
      tailleOrganisation: donneesTestMaturite.taille_organisation,
      codeSessionGroupe: donneesTestMaturite.code_session_groupe,
    });
  }

  async parId(id: string): Promise<ResultatTestMaturite | undefined> {
    const donnees = await this.knex('resultats_test').where({ id }).first();
    return donnees ? this.traduitEnResultatTestMaturite(donnees) : undefined;
  }

  async dernierPourUtilisateur(
    emailUtilisateur: string
  ): Promise<ResultatTestMaturite | undefined> {
    const donnees = await this.knex('resultats_test')
      .where({ email_utilisateur: emailUtilisateur })
      .orderBy('date_realisation', 'desc')
      .first();
    return donnees ? this.traduitEnResultatTestMaturite(donnees) : undefined;
  }

  async metsAjour(resultatTest: ResultatTestMaturite): Promise<void> {
    await this.knex('resultats_test').where({ id: resultatTest.id }).update({
      email_utilisateur: resultatTest.emailUtilisateur,
    });
  }

  async ajoute(resultatTest: ResultatTestMaturite): Promise<void> {
    const {
      emailUtilisateur,
      tailleOrganisation,
      codeSessionGroupe,
      ...reste
    } = resultatTest;
    await this.knex('resultats_test').insert({
      ...reste,
      email_utilisateur: emailUtilisateur,
      taille_organisation: tailleOrganisation,
      code_session_groupe: codeSessionGroupe,
    });
  }
}
