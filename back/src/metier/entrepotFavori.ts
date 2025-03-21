import { Favori } from './favori';

export interface EntrepotFavori {
  ajoute(favori: Favori): Promise<void>;

  tousCeuxDeUtilisateur(emailUtilisateur: string): Promise<Favori[]>;

  retire(favori: Favori): Promise<void>;
}
