import { Favori } from './favori.js';
import { Utilisateur } from './utilisateur.js';

export interface EntrepotFavori {
  ajoute(favori: Favori): Promise<void>;

  tousCeuxDeUtilisateur(utilisateur: Utilisateur): Promise<Favori[]>;

  retire(favori: Favori): Promise<void>;
}
