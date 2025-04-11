export interface UtilisateurBDD {
  email: string;
  donnees: {
    email: string;
    cguAcceptees: boolean;
    infolettreAcceptee: boolean;
  };
  id_liste_favoris: string;
}
