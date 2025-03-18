import Knex from 'knex';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { Utilisateur } from '../metier/utilisateur';
import config from '../../knexfile';
import { UtilisateurBDD } from './utilisateurBDD';
import { AdaptateurProfilAnssi } from './adaptateurProfilAnssi';
import { AdaptateurRechercheEntreprise } from './adaptateurRechercheEntreprise';

export class EntrepotUtilisateurMPAPostgres implements EntrepotUtilisateur {
  knex: Knex.Knex;
  adaptateurProfilAnssi: AdaptateurProfilAnssi;
  adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise;

  constructor(
    adaptateurProfilAnssi: AdaptateurProfilAnssi,
    adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise
  ) {
    this.knex = Knex(config);
    this.adaptateurProfilAnssi = adaptateurProfilAnssi;
    this.adaptateurRechercheEntreprise = adaptateurRechercheEntreprise;
  }

  private chiffreDonneesUtilisateur(utilisateur: Utilisateur): UtilisateurBDD {
    return { email: utilisateur.email, donnees: utilisateur };
  }

  private dechiffreDonneesUtilisateur(
    utilisateur: UtilisateurBDD
  ): Utilisateur {
    const { email, donnees } = utilisateur;
    return {
      ...donnees,
      email,
      nom: '',
      prenom: '',
      telephone: '',
      domainesSpecialite: [],
      siretEntite: '',
    };
  }

  async ajoute(utilisateur: Utilisateur) {
    const { prenom, nom, telephone, email, domainesSpecialite, siretEntite } =
      utilisateur;
    await this.knex('utilisateurs').insert(
      this.chiffreDonneesUtilisateur(utilisateur)
    );
    const organisations =
      await this.adaptateurRechercheEntreprise.rechercheOrganisations(
        siretEntite,
        null
      );
    await this.adaptateurProfilAnssi.metsAJour({
      prenom,
      nom,
      telephone,
      email,
      domainesSpecialite,
      organisation: organisations[0],
    });
  }

  async parEmail(email: string) {
    const utilisateur = await this.knex('utilisateurs')
      .where({ email })
      .first();
    if (!utilisateur) return undefined;
    return this.dechiffreDonneesUtilisateur(utilisateur);
  }

  async existe(email: string) {
    const utilisateur = await this.knex('utilisateurs')
      .where({ email })
      .first();
    return !!utilisateur;
  }
}
