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
        id_item_cyber: favori.idItemCyber,
      })
      .delete();
  }

  async tousCeuxDeUtilisateur(emailUtilisateur: string): Promise<Favori[]> {
    const favoris = await this.knex('favoris')
      .where('email_utilisateur', emailUtilisateur)
      .orderBy('date_ajout', 'desc');
    return favoris.map(
      ({
        email_utilisateur: emailUtilisateur,
        id_item_cyber: idItemCyber,
      }) => ({
        emailUtilisateur,
        idItemCyber,
      })
    );
  }

  async ajoute(favori: Favori): Promise<void> {
    await this.knex('favoris').insert({
      email_utilisateur: favori.emailUtilisateur,
      id_item_cyber: favori.idItemCyber,
    });
  }
}
