import { Utilisateur } from './utilisateur';

export interface EntrepotUtilisateur {
  ajoute: (utilisateur: Utilisateur) => Promise<void>;
  parEmail: (email: string) => Promise<Utilisateur | undefined>;
  existe: (email: string) => Promise<boolean>;
}
