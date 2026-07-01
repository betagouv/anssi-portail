import { EntrepotFavori } from '../../src/metier/entrepotFavori.js';
import { Favori } from '../../src/metier/favori.js';
import { EntrepotMemoire } from './entrepotMemoire.js';
import { Utilisateur } from '../../src/metier/utilisateur.js';

export class EntrepotFavoriMemoire extends EntrepotMemoire<Favori> implements EntrepotFavori {
  async retire(favori: Favori): Promise<void> {
    this.entites = this.entites.filter(
      (f) => !(f.utilisateur.email === favori.utilisateur.email && f.idItemCyber === favori.idItemCyber)
    );
  }

  async tousCeuxDeUtilisateur(utilisateur: Utilisateur): Promise<Favori[]> {
    return this.entites.filter((entite) => entite.utilisateur.email === utilisateur.email);
  }
}
