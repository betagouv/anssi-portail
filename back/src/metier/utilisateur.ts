export interface Utilisateur {
  email: string;
  prenom: string;
  nom: string;
  telephone: string;
  postes: string[];
  siretEntite: string;
  cguAcceptees: boolean;
  infolettreAcceptee: boolean;
}
