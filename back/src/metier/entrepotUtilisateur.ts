import { ClasseUtilisateur, Utilisateur } from './utilisateur';

export interface EntrepotUtilisateur {
  ajoute: (utilisateur: ClasseUtilisateur) => Promise<void>;
  parEmail: (email: string) => Promise<ClasseUtilisateur | undefined>;
  existe: (email: string) => Promise<boolean>;
  parIdListeFavoris: (
    idListeFavoris: string
  ) => Promise<Utilisateur | undefined>;
  tous: () => Promise<Utilisateur[]>;
}
