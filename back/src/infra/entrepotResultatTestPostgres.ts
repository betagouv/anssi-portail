import { EntrepotResultatTest } from '../metier/entrepotResultatTest';
import { ResultatTestMaturite } from '../metier/resultatTestMaturite';
import Knex from 'knex';
import config from '../../knexfile';

export class EntrepotResultatTestPostgres implements EntrepotResultatTest {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async parId(id: string): Promise<ResultatTestMaturite | undefined> {
    const donnees: any = await this.knex('resultats_test')
      .where({ id })
      .first();
    return donnees
      ? new ResultatTestMaturite({
          ...donnees,
          emailUtilisateur: donnees.email_utilisateur,
          tailleOrganisation: donnees.taille_organisation,
        })
      : undefined;
  }

  async dernierPourUtilisateur(
    emailUtilisateur: string
  ): Promise<ResultatTestMaturite | undefined> {
    const donnees: any = await this.knex('resultats_test')
      .where({ email_utilisateur: emailUtilisateur })
      .orderBy('date_realisation', 'desc')
      .first();
    return donnees
      ? new ResultatTestMaturite({
          ...donnees,
          emailUtilisateur: donnees.email_utilisateur,
          tailleOrganisation: donnees.taille_organisation,
        })
      : undefined;
  }

  async metsAjour(resultatTest: ResultatTestMaturite): Promise<void> {
    await this.knex('resultats_test').where({ id: resultatTest.id }).update({
      email_utilisateur: resultatTest.emailUtilisateur,
    });
  }

  async ajoute(resultatTest: ResultatTestMaturite): Promise<void> {
    const { emailUtilisateur, tailleOrganisation, ...reste } = resultatTest;
    await this.knex('resultats_test').insert({
      ...reste,
      email_utilisateur: emailUtilisateur,
      taille_organisation: tailleOrganisation,
    });
  }
}
