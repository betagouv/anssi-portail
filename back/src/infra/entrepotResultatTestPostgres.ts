import { EntrepotResultatTest } from '../metier/entrepotResultatTest';
import { ResultatTestMaturite } from '../metier/resultatTestMaturite';
import Knex from 'knex';
import config from '../../knexfile';

export class EntrepotResultatTestPostgres implements EntrepotResultatTest {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async ajoute(resultatTest: ResultatTestMaturite): Promise<void> {
    let { emailUtilisateur, tailleOrganisation, ...reste } = resultatTest;
    await this.knex('resultats_test').insert({
      ...reste,
      email_utilisateur: emailUtilisateur,
      taille_organisation: tailleOrganisation,
    });
  }
}
