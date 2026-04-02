import { AdaptateurRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';

export type Role = 'GESTION_GUIDES';

export class Organisation {
  nom: string;
  siret: string;
  departement: string | null;
  region: string | undefined;
  codeActivite: string;

  constructor({
    nom,
    siret,
    departement,
    codeRegion,
    codeActivite,
  }: {
    nom: string;
    siret: string;
    departement: string | null;
    codeRegion?: string;
    codeActivite: string;
  }) {
    this.nom = nom;
    this.siret = siret;
    this.departement = departement;
    this.region = codeRegion;
    this.codeActivite = codeActivite;
  }

  estAnssi = () => {
    return this.siret.startsWith('130007669');
  };
}

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
  roles?: Role[];
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
  idListeFavoris: string | undefined;
  private adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  private _organisation: Organisation | undefined;
  roles: Role[];

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
      roles = [],
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
    this.idListeFavoris = idListeFavoris ?? undefined;
    this._organisation = organisation;
    this.roles = roles;
  }

  async organisation(): Promise<Organisation> {
    if (!this._organisation) {
      const organisations = await this.adaptateurRechercheEntreprise.rechercheOrganisations(this.siretEntite, null);
      this._organisation = new Organisation(organisations[0]);
    }
    return this._organisation;
  }

  estAgentAnssi = async () => {
    return (await this.organisation()).estAnssi();
  };

  peutManipulerLesDocumentsDUnGuide = () => {
    return this.roles.includes('GESTION_GUIDES');
  };
}
