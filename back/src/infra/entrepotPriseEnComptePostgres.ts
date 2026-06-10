import Knex from 'knex';
import config from '../../knexfile';
import { EntrepotMesure } from '../metier/entrepotMesure';
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

  constructor(
    private readonly adaptateurHachage: AdaptateurHachage,
    private readonly entrepotMesure: EntrepotMesure
  ) {
    this.knex = Knex(config);
  }

  pour(utilisateur: Utilisateur): Promise<PriseEnCompte[]>;
  pour(utilisateur: Utilisateur, mesure: Mesure): Promise<PriseEnCompte | undefined>;
  async pour(utilisateur: Utilisateur, mesure?: Mesure) {
    if (mesure) {
      const resultat = await this.knex<PriseEnComptePersistee>('prises_en_compte')
        .where({
          email_utilisateur_hache: this.adaptateurHachage.hache(utilisateur.email),
          id_mesure: mesure.id,
        })
        .first();
      if (resultat) {
        return new PriseEnCompte(utilisateur, mesure);
      }
    } else {
      const resultat = await this.knex<PriseEnComptePersistee>('prises_en_compte').where({
        email_utilisateur_hache: this.adaptateurHachage.hache(utilisateur.email),
      });
      const mesuresCorrespondantes = await Promise.all(resultat.map((r) => this.entrepotMesure.parId(r.id_mesure)));
      return mesuresCorrespondantes.reduce((prisesEnCompte, mesure) => {
        if (mesure) {
          prisesEnCompte.push(new PriseEnCompte(utilisateur, mesure));
        }
        return prisesEnCompte;
      }, [] as PriseEnCompte[]);
    }
  }

  async ajoute(priseEnCompte: PriseEnCompte): Promise<void> {
    await this.knex<PriseEnComptePersistee>('prises_en_compte')
      .insert({
        email_utilisateur_hache: this.adaptateurHachage.hache(priseEnCompte.utilisateur.email),
        id_mesure: priseEnCompte.mesure.id,
      })
      .onConflict()
      .ignore();
  }
}
