import Knex from 'knex';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { Utilisateur } from '../metier/utilisateur';
import config from '../../knexfile';
import { UtilisateurBDD } from './utilisateurBDD';
import { AdaptateurProfilAnssi } from './adaptateurProfilAnssi';
import { AdaptateurRechercheEntreprise } from './adaptateurRechercheEntreprise';
import pThrottle from 'p-throttle';

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
    return {
      email: utilisateur.email,
      donnees: utilisateur,
      id_liste_favoris: utilisateur.idListeFavoris,
    };
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

  async ajoute(utilisateur: Utilisateur) {
    // Enregistrement dans la BDD
    await this.knex('utilisateurs').insert(
      this.chiffreDonneesUtilisateur(utilisateur)
    );

    // Enregistrement dans MPA
    const organisation = await utilisateur.organisation();
    const { prenom, nom, telephone, email, domainesSpecialite } = utilisateur;
    await this.adaptateurProfilAnssi.metsAJour({
      prenom,
      nom,
      telephone,
      email,
      domainesSpecialite,
      organisation,
    });
  }

  private async hydrateUtilisateur(utilisateur: UtilisateurBDD) {
    const donnees = this.dechiffreDonneesUtilisateur(utilisateur);
    const profilAnssi = await this.adaptateurProfilAnssi.recupere(
      donnees.email
    );
    if (!profilAnssi) {
      console.warn(
        'Utilisateur trouvé en base de données sans profil ANSSI ',
        utilisateur.email
      );
      return undefined;
    }

    const { prenom, nom, telephone, domainesSpecialite, organisation } =
      profilAnssi;

    return new Utilisateur(
      {
        email: donnees.email,
        prenom,
        nom,
        telephone,
        domainesSpecialite,
        cguAcceptees: donnees.cguAcceptees,
        infolettreAcceptee: donnees.infolettreAcceptee,
        siretEntite: organisation.siret,
        idListeFavoris: utilisateur.id_liste_favoris,
        organisation,
      },
      this.adaptateurRechercheEntreprise
    );
  }

  async parEmail(email: string): Promise<Utilisateur | undefined> {
    const utilisateur = await this.knex('utilisateurs')
      .where({ email })
      .first();
    if (!utilisateur) return undefined;
    return this.hydrateUtilisateur(utilisateur);
  }

  async parIdListeFavoris(
    idListeFavoris: string
  ): Promise<Utilisateur | undefined> {
    const utilisateur = await this.knex('utilisateurs')
      .where({ id_liste_favoris: idListeFavoris })
      .first();
    if (!utilisateur) return undefined;

    return this.hydrateUtilisateur(utilisateur);
  }

  async existe(email: string) {
    const utilisateur = await this.knex('utilisateurs')
      .where({ email })
      .first();
    return !!utilisateur;
  }

  async tous() {
    const utilisateursBDD = await this.knex('utilisateurs');
    const result: Utilisateur[] = [];
    const enCadence = pThrottle({ limit: 1, interval: 700 });

    for (const utilisateurBDD of utilisateursBDD) {
      const utilisateur = await enCadence(() =>
        this.hydrateUtilisateur(utilisateurBDD)
      )();
      if (utilisateur) result.push(utilisateur);
    }
    return result;
  }
}
