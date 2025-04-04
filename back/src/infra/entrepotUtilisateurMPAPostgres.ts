import Knex from 'knex';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { Utilisateur, UtilisateurPartiel } from '../metier/utilisateur';
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

  private chiffreDonneesUtilisateur(
    utilisateur: UtilisateurPartiel
  ): UtilisateurBDD {
    return { email: utilisateur.email, donnees: utilisateur };
  }

  private dechiffreDonneesUtilisateur(
    utilisateur: UtilisateurBDD
  ): UtilisateurBDD['donnees'] {
    const { email, donnees } = utilisateur;
    return {
      ...donnees,
      email,
    };
  }

  async ajoute(utilisateur: UtilisateurPartiel) {
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

  async parEmail(email: string): Promise<Utilisateur | undefined> {
    const utilisateur = await this.knex('utilisateurs')
      .where({ email })
      .first();
    if (!utilisateur) return undefined;

    const donnees = this.dechiffreDonneesUtilisateur(utilisateur);
    const { prenom, nom, telephone, domainesSpecialite, organisation } =
      (await this.adaptateurProfilAnssi.recupere(donnees.email))!;
    return {
      ...donnees,
      idListeFavoris: utilisateur.id_liste_favoris,
      email,
      prenom,
      nom,
      telephone,
      domainesSpecialite,
      organisation,
    };
  }

  async parIdListeFavoris(
    idListeFavoris: string
  ): Promise<Utilisateur | undefined> {
    const utilisateur = await this.knex('utilisateurs')
      .where({ id_liste_favoris: idListeFavoris })
      .first();
    if (!utilisateur) return undefined;

    const donnees = this.dechiffreDonneesUtilisateur(utilisateur);
    const { prenom, nom, telephone, domainesSpecialite, organisation } =
      (await this.adaptateurProfilAnssi.recupere(donnees.email))!;
    return {
      ...donnees,
      idListeFavoris: utilisateur.id_liste_favoris,
      prenom,
      nom,
      telephone,
      domainesSpecialite,
      organisation,
    };
  }

  async existe(email: string) {
    const utilisateur = await this.knex('utilisateurs')
      .where({ email })
      .first();
    return !!utilisateur;
  }
}
