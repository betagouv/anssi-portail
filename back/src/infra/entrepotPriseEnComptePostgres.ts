import Knex from 'knex';
import config from '../../knexfile';
import { EntrepotPriseEnCompte } from '../metier/entrepotPriseEnCompte';
import { Mesure } from '../metier/mesure';
import { PriseEnCompte } from '../metier/PriseEnCompte';
import { Utilisateur } from '../metier/utilisateur';
import { AdaptateurHachage } from './adaptateurHachage';

type PriseEnComptePersistee = {
  email_utilisateur_hache: string;
  id_mesure: string;
};

export class EntrepotPriseEnComptePostgres implements EntrepotPriseEnCompte {
  knex: Knex.Knex;

  constructor(readonly adaptateurHachage: AdaptateurHachage) {
    this.knex = Knex(config);
  }

  async pour(utilisateur: Utilisateur, mesure: Mesure): Promise<PriseEnCompte | undefined> {
    const resultat = await this.knex<PriseEnComptePersistee>('prises_en_compte')
      .where({
        email_utilisateur_hache: this.adaptateurHachage.hache(utilisateur.email),
        id_mesure: mesure.id,
      })
      .first();
    if (resultat) {
      return new PriseEnCompte(utilisateur, mesure);
    }
  }
}
