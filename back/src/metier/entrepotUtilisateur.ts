import { Utilisateur } from './utilisateur.js';

export interface EntrepotUtilisateur {
  ajoute: (utilisateur: Utilisateur) => Promise<void>;
  parEmailHache: (emailHache: string) => Promise<Utilisateur | undefined>;
  existe: (emailHache: string) => Promise<boolean>;
  parIdListeFavoris: (idListeFavoris: string) => Promise<Utilisateur | undefined>;
  tous: () => Promise<Utilisateur[]>;
  taille: () => Promise<number>;
  metsAJour: (utilisateur: Utilisateur) => Promise<void>;
}
