import { BusEvenements } from '../bus/busEvenements';
import { BadgeCyberdépartDébloqué } from '../bus/evenements/badgeCyberdepartDebloque';
import { MesurePriseEnCompte } from '../bus/evenements/mesurePriseEnCompte';
import { ModuleTermine } from '../bus/evenements/moduleTermine';
import { AdaptateurHachage } from '../infra/adaptateurHachage';
import { AdaptateurRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise';
import { EntrepotPriseEnCompte } from './entrepotPriseEnCompte';
import { Mesure } from './mesure';
import { Module } from './module';
import { PriseEnCompte } from './PriseEnCompte';

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
  mesuresPrisesEnCompte?: Mesure[];
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
  mesuresPrisesEnCompte: Mesure[];
  private adaptateurHachage: AdaptateurHachage;

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
      mesuresPrisesEnCompte = [],
    }: InformationsCreationUtilisateur,
    adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise,
    adaptateurHachage: AdaptateurHachage
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
    this.mesuresPrisesEnCompte = mesuresPrisesEnCompte;
    this.adaptateurHachage = adaptateurHachage;
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

  estPriseEnCompte(mesure: Mesure): boolean {
    return this.mesuresPrisesEnCompte.some((m) => m.id === mesure.id);
  }

  emailHache() {
    return this.adaptateurHachage.hache(this.email);
  }

  async prendEnCompte(
    mesure: Mesure,
    rang: number,
    entrepotPriseEnCompte: EntrepotPriseEnCompte,
    busEvenements: BusEvenements,
    module: Module
  ) {
    if (this.estPriseEnCompte(mesure)) {
      return;
    }
    await entrepotPriseEnCompte.ajoute(new PriseEnCompte(this, mesure));
    await busEvenements.publie(new MesurePriseEnCompte(this.emailHache(), mesure.id, module.mesures.length, rang + 1));
    this.mesuresPrisesEnCompte.push(mesure);
    if (this.mesuresPrisesEnCompte.length === module.mesures.length) {
      await busEvenements.publie(new ModuleTermine(this.emailHache(), 1, 'Cyberdépart'));
    }
    const cibleBadgeCyberdépart = module.cibleDéblocageBadgeCyberdépart();
    if (this.mesuresPrisesEnCompte.length === cibleBadgeCyberdépart) {
      await busEvenements.publie(new BadgeCyberdépartDébloqué(this.emailHache()));
    }
  }
}
