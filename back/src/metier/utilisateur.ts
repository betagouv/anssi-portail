type Organisation = {
  nom: string;
  siret: string;
  departement: string;
};
export interface Utilisateur {
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  domainesSpecialite: string[];
  organisation: Organisation;
  cguAcceptees: boolean;
  infolettreAcceptee: boolean;
}

export interface UtilisateurPartiel {
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  domainesSpecialite: string[];
  siretEntite: string;
  cguAcceptees: boolean;
  infolettreAcceptee: boolean;
}
