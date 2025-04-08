import { EntrepotFavori } from '../../src/metier/entrepotFavori';
import { Favori } from '../../src/metier/favori';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotFavoriMemoire extends EntrepotMemoire<Favori> implements EntrepotFavori {

  async retire(favori: Favori): Promise<void> {
    this.entites = this.entites.filter(
      (f) =>
        !(
          f.emailUtilisateur === favori.emailUtilisateur &&
          f.idItemCyber === favori.idItemCyber
        )
    );
  }

  async tousCeuxDeUtilisateur(emailUtilisateur: string): Promise<Favori[]> {
    return this.entites.filter(
      (entite) => entite.emailUtilisateur === emailUtilisateur
    );
  }
}
