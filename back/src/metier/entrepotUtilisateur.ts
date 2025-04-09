import { Utilisateur, UtilisateurPartiel } from './utilisateur';

export interface EntrepotUtilisateur {
  ajoute: (utilisateur: UtilisateurPartiel) => Promise<void>;
  parEmail: (email: string) => Promise<Utilisateur | undefined>;
  existe: (email: string) => Promise<boolean>;
  parIdListeFavoris: (
    idListeFavoris: string
  ) => Promise<Utilisateur | undefined>;
  tous: () => Promise<Utilisateur[]>;
}
