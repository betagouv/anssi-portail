import { Utilisateur } from '../../utilisateur.js';

export type RésultatTestVraiFaux = {
  utilisateur: Utilisateur;
  score: string;
};

export interface EntrepôtRésultatTestVraiFaux {
  ajoute(entité: RésultatTestVraiFaux): Promise<void>;
  taille(): Promise<number>;
}
