import { Mesure } from '../../../src/metier/mesure';
import { Utilisateur } from '../../../src/metier/utilisateur';
import { fauxAdaptateurRechercheEntreprise } from '../fauxObjets';

export class ConstructeurDUtilisateur {
  private email: string = 'utilisateur@mail.com';
  private prenom: string = 'Prenom';
  private nom: string = 'Nom';
  private telephone?: string;
  private domainesSpecialite: string[] = [];
  private siretEntite: string = '13000766900018';
  private cguAcceptees: boolean = true;
  private infolettreAcceptee: boolean = true;
  private idListeFavoris?: string;
  private readonly mesuresPrisesEnCompte: Mesure[] = [];

  avecLEmail(email: string) {
    this.email = email;
    return this;
  }

  avecLePrenom(prenom: string) {
    this.prenom = prenom;
    return this;
  }

  avecLeNom(nom: string) {
    this.nom = nom;
    return this;
  }

  avecLeTelephone(telephone: string) {
    this.telephone = telephone;
    return this;
  }

  avecLesDomainesSpecialite(domainesSpecialite: string[]) {
    this.domainesSpecialite = domainesSpecialite;
    return this;
  }

  avecLeSiretEntite(siretEntite: string) {
    this.siretEntite = siretEntite;
    return this;
  }

  avecLesAvecCguAcceptees(cguAcceptees: boolean) {
    this.cguAcceptees = cguAcceptees;
    return this;
  }

  avecLInfolettre(infolettreAcceptee: boolean) {
    this.infolettreAcceptee = infolettreAcceptee;
    return this;
  }

  avecLIdListeFavoris(idListeFavoris: string) {
    this.idListeFavoris = idListeFavoris;
    return this;
  }

  avecUneMesurePriseEnCompte(mesure: Mesure) {
    this.mesuresPrisesEnCompte.push(mesure);
    return this;
  }

  construis() {
    return new Utilisateur(
      {
        email: this.email,
        prenom: this.prenom,
        nom: this.nom,
        telephone: this.telephone,
        domainesSpecialite: this.domainesSpecialite,
        siretEntite: this.siretEntite,
        cguAcceptees: this.cguAcceptees,
        infolettreAcceptee: this.infolettreAcceptee,
        idListeFavoris: this.idListeFavoris,
        mesuresPrisesEnCompte: this.mesuresPrisesEnCompte,
      },
      fauxAdaptateurRechercheEntreprise
    );
  }
}

export function utilisateurDeTest() {
  return new ConstructeurDUtilisateur();
}
