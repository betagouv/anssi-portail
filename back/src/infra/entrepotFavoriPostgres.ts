import Knex from 'knex';
import config from '../../knexfile';
import { EntrepotFavori } from '../metier/entrepotFavori';
import { Favori } from '../metier/favori';

export class EntrepotFavoriPostgres implements EntrepotFavori {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  async retire(favori: Favori): Promise<void> {
    await this.knex('favoris')
      .where({
        email_utilisateur: favori.emailUtilisateur,
        id: favori.id,
      })
      .delete();
  }

  async tousCeuxDeUtilisateur(emailUtilisateur: string): Promise<Favori[]> {
    return this.knex('favoris')
      .where('email_utilisateur', emailUtilisateur)
      .orderBy('date_ajout', 'desc');
  }

  async ajoute(favori: Favori): Promise<void> {
    await this.knex('favoris').insert({
      email_utilisateur: favori.emailUtilisateur,
      id: favori.id,
    });
  }
}
