import { Utilisateur } from './Utilisateur';

export interface EntrepotUtilisateur {
  ajoute: (utilisateur: Utilisateur) => void;
  parEmail: (email: string) => Utilisateur | undefined;
}
