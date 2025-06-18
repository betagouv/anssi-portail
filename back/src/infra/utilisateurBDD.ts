export interface UtilisateurBDD {
  email_hache: string;
  donnees: {
    email: string;
    cguAcceptees: boolean;
    infolettreAcceptee: boolean;
  };
  id_liste_favoris: string | undefined;
}
