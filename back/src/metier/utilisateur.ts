import { AdaptateurRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';

type Organisation = {
  nom: string;
  siret: string;
  departement: string | null;
};

interface InformationsCreationUtilisateur {
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  domainesSpecialite: string[];
  siretEntite: string;
  cguAcceptees: boolean;
  infolettreAcceptee: boolean;
  idListeFavoris?: string;
  organisation?: Organisation;
}

export class Utilisateur {
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  domainesSpecialite: string[];
  cguAcceptees: boolean;
  infolettreAcceptee: boolean;
  siretEntite: string;
  idListeFavoris: string;
  private adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  private _organisation: Organisation | undefined;

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
      idListeFavoris,
      organisation,
    }: InformationsCreationUtilisateur,
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
    this.idListeFavoris = idListeFavoris ?? '';
    this._organisation = organisation;
  }

  async organisation(): Promise<Organisation> {
    if (!this._organisation) {
      const organisations =
        await this.adaptateurRechercheEntreprise.rechercheOrganisations(
          this.siretEntite,
          null
        );
      this._organisation = organisations[0];
    }
    return this._organisation;
  }
}
