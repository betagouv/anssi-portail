export interface UtilisateurBDD {
  email_hache: string;
  email_hache_256: string;
  donnees: {
    email: string;
    cguAcceptees: boolean;
    infolettreAcceptee: boolean;
  };
  id_liste_favoris: string | undefined;
}
