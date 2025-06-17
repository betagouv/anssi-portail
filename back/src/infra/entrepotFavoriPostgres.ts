import Knex from 'knex';
import config from '../../knexfile';
import { EntrepotFavori } from '../metier/entrepotFavori';
import { Favori } from '../metier/favori';
import { Utilisateur } from '../metier/utilisateur';
import { AdaptateurHachage } from './adaptateurHachage';

export class EntrepotFavoriPostgres implements EntrepotFavori {
  knex: Knex.Knex;
  private adaptateurHachage: AdaptateurHachage;

  constructor({ adaptateurHachage }: { adaptateurHachage: AdaptateurHachage }) {
    this.adaptateurHachage = adaptateurHachage;
    this.knex = Knex(config);
  }

  async retire(favori: Favori): Promise<void> {
    await this.knex('favoris')
      .where({
        email_utilisateur_hache: this.adaptateurHachage.hache(
          favori.utilisateur.email
        ),
        id_item_cyber: favori.idItemCyber,
      })
      .delete();
  }

  async tousCeuxDeUtilisateur(utilisateur: Utilisateur): Promise<Favori[]> {
    const favoris = await this.knex('favoris')
      .where({
        email_utilisateur_hache: this.adaptateurHachage.hache(
          utilisateur.email
        ),
      })
      .orderBy('date_ajout', 'desc');
    return favoris.map(({ id_item_cyber: idItemCyber }) => ({
      utilisateur,
      idItemCyber,
    }));
  }

  async ajoute(favori: Favori): Promise<void> {
    await this.knex('favoris').insert({
      email_utilisateur_hache: this.adaptateurHachage.hache(
        favori.utilisateur.email
      ),
      id_item_cyber: favori.idItemCyber,
    });
  }
}
