import { AdaptateurRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';

type Organisation = {
  nom: string;
  siret: string;
  departement: string | null;
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
  idListeFavoris: string;
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

export class ClasseUtilisateur implements UtilisateurPartiel{
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  domainesSpecialite: string[];
  cguAcceptees: boolean;
  infolettreAcceptee: boolean;
  siretEntite: string;
  idListeFavoris!: string;
  private adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;

  constructor(
    {
      email,
      prenom,
      nom,
      telephone,
      domainesSpecialite,
      cguAcceptees,
      infolettreAcceptee,
      siretEntite,
    }: UtilisateurPartiel,
    adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise
  ) {
    this.email = email;
    this.prenom = prenom;
    this.nom = nom;
    this.telephone = telephone;
    this.domainesSpecialite = domainesSpecialite;
    this.cguAcceptees = cguAcceptees;
    this.infolettreAcceptee = infolettreAcceptee;
    this.siretEntite = siretEntite;
    this.adaptateurRechercheEntreprise = adaptateurRechercheEntreprise;
    // this.idListeFavoris = idListeFavoris;
  }

  async organisation(): Promise<Organisation> {
    const organisations =
      await this.adaptateurRechercheEntreprise.rechercheOrganisations(
        this.siretEntite,
        null
      );
    return organisations[0];
  }
}
