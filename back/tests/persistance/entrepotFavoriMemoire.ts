import { EntrepotFavori } from '../../src/metier/entrepotFavori';
import { Favori } from '../../src/metier/favori';

export class EntrepotFavoriMemoire implements EntrepotFavori {
  entites: Favori[] = [];

  async ajoute(favori: Favori): Promise<void> {
    this.entites.push(favori);
  }

  async tousCeuxDeUtilisateur(emailUtilisateur: string): Promise<Favori[]> {
    return this.entites.filter(
      (entite) => entite.emailUtilisateur === emailUtilisateur
    );
  }
}
