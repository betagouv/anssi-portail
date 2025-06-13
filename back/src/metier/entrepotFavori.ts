import { Favori } from './favori';
import { Utilisateur } from './utilisateur';

export interface EntrepotFavori {
  ajoute(favori: Favori): Promise<void>;

  tousCeuxDeUtilisateur(utilisateur: Utilisateur): Promise<Favori[]>;

  retire(favori: Favori): Promise<void>;
}
