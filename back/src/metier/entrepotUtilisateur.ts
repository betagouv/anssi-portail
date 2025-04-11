import { ClasseUtilisateur } from './utilisateur';

export interface EntrepotUtilisateur {
  ajoute: (utilisateur: ClasseUtilisateur) => Promise<void>;
  parEmail: (email: string) => Promise<ClasseUtilisateur | undefined>;
  existe: (email: string) => Promise<boolean>;
  parIdListeFavoris: (
    idListeFavoris: string
  ) => Promise<ClasseUtilisateur | undefined>;
  tous: () => Promise<ClasseUtilisateur[]>;
}
