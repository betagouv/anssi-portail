import { BusEvenements } from '../bus/busEvenements.js';
import { BadgeCyberdépartDébloqué } from '../bus/evenements/badgeCyberdepartDebloque.js';
import { MesurePriseEnCompte } from '../bus/evenements/mesurePriseEnCompte.js';
import { ModuleTermine } from '../bus/evenements/moduleTermine.js';
import { ParcoursChangé } from '../bus/evenements/parcoursChange.js';
import { ParcoursRejoint } from '../bus/evenements/parcoursRejoint.js';
import { AdaptateurHachage } from '../infra/adaptateurHachage.js';
import { AdaptateurRechercheEntreprise } from '../infra/adaptateurRechercheEntreprise.js';
import { EntrepotPriseEnCompte } from './entrepotPriseEnCompte.js';
import { Mesure } from './mesure.js';
import { Module } from './module.js';
import { MotifChangementParcours, Parcours } from './parcours.js';

import { PriseEnCompte } from './PriseEnCompte.js';

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
  pixelDeSuiviAccepté: boolean;
  idListeFavoris?: string;
  organisation?: Organisation;
  roles?: Role[];
  mesuresPrisesEnCompte?: Mesure[];
  parcours?: Parcours | null;
}

export class Utilisateur {
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  domainesSpecialite: string[];
  cguAcceptees: boolean;
  infolettreAcceptee: boolean;
  pixelDeSuiviAccepté: boolean;
  siretEntite: string;
  idListeFavoris: string | undefined;
  private adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;
  private _organisation: Organisation | undefined;
  roles: Role[];
  mesuresPrisesEnCompte: Mesure[];
  private adaptateurHachage: AdaptateurHachage;
  private parcours?: Parcours | null;

  constructor(
    {
      email,
      prenom,
      nom,
      telephone,
      domainesSpecialite,
      cguAcceptees,
      infolettreAcceptee,
      pixelDeSuiviAccepté,
      siretEntite,
      idListeFavoris,
      organisation,
      roles = [],
      mesuresPrisesEnCompte = [],
      parcours = null,
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
    this.pixelDeSuiviAccepté = pixelDeSuiviAccepté;
    this.siretEntite = siretEntite;
    this.adaptateurRechercheEntreprise = adaptateurRechercheEntreprise;
    this.idListeFavoris = idListeFavoris ?? undefined;
    this._organisation = organisation;
    this.roles = roles;
    this.mesuresPrisesEnCompte = mesuresPrisesEnCompte;
    this.adaptateurHachage = adaptateurHachage;
    this.parcours = parcours;
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
    entrepotPriseEnCompte: EntrepotPriseEnCompte,
    busEvenements: BusEvenements,
    module: Module
  ): Promise<{
    badgeCyberdépartDebloqué: boolean;
    moduleTerminé: boolean;
  }> {
    const nouvelEtatModule = {
      badgeCyberdépartDebloqué: false,
      moduleTerminé: false,
    };
    if (this.estPriseEnCompte(mesure)) {
      return nouvelEtatModule;
    }
    await entrepotPriseEnCompte.ajoute(new PriseEnCompte(this, mesure));
    await busEvenements.publie(
      new MesurePriseEnCompte(
        this.emailHache(),
        mesure.id,
        module.nombreDeMesures(),
        module.positionDeLaMesure(mesure),
        this.parcours ?? undefined
      )
    );
    this.mesuresPrisesEnCompte.push(mesure);
    if (this.nombreDeMesuresPrisesEnCompte(module) === module.nombreDeMesures()) {
      await busEvenements.publie(
        new ModuleTermine(this.emailHache(), module.id, module.nom, this.parcours ?? undefined)
      );
      nouvelEtatModule.moduleTerminé = true;
    }
    const cibleBadgeCyberdépart = module.cibleDéblocageBadgeCyberdépart();
    if (this.nombreDeMesuresPrisesEnCompte(module) === cibleBadgeCyberdépart) {
      await busEvenements.publie(
        new BadgeCyberdépartDébloqué(
          this.emailHache(),
          this.nombreDeMesuresPrisesEnCompte(module),
          module.nombreDeMesures()
        )
      );
      nouvelEtatModule.badgeCyberdépartDebloqué = true;
    }

    if (!this.parcours || !module.estCyberdépart()) {
      await this.rejoinsParcours(
        module.estCyberdépart() ? 'allégé' : 'complet',
        busEvenements,
        'prise-en-compte-mesure'
      );
    }

    return nouvelEtatModule;
  }

  nombreDeMesuresPrisesEnCompte(module: Module) {
    const mesuresDuModulePriseEnCompte = this.mesuresPrisesEnCompte.filter((mesurePriseEnCompte) =>
      module.mesures.map((mesure) => mesure.id).includes(mesurePriseEnCompte.id)
    );
    return mesuresDuModulePriseEnCompte.length;
  }

  async rejoinsParcours(parcours: Parcours, busEvenements: BusEvenements, motif: MotifChangementParcours) {
    if (this.parcours === parcours || this.parcours === 'complet') return;
    if (!this.parcours) {
      await busEvenements.publie(new ParcoursRejoint(this.emailHache(), parcours, motif));
    } else {
      await busEvenements.publie(new ParcoursChangé(this.emailHache(), this.parcours, parcours, motif));
    }
    this.parcours = parcours;
  }

  parcoursActuel() {
    return this.parcours;
  }
}
