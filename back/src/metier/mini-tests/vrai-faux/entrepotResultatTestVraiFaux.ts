import { RésultatTestVraiFaux } from './resultatTestVraiFaux.js';

export interface EntrepôtRésultatTestVraiFaux {
  ajoute(entité: RésultatTestVraiFaux): Promise<void>;
  taille(): Promise<number>;
}
