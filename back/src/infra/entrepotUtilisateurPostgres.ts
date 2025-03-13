import Knex from 'knex';
import { EntrepotUtilisateur } from '../metier/entrepotUtilisateur';
import { Utilisateur } from '../metier/utilisateur';
import config from '../../knexfile';
import { UtilisateurBDD } from './utilisateurBDD';

export class EntrepotUtilisateurPostgres implements EntrepotUtilisateur {
  knex: Knex.Knex;

  constructor() {
    this.knex = Knex(config);
  }

  private chiffreDonneesUtilisateur(utilisateur: Utilisateur): UtilisateurBDD {
    return { email: utilisateur.email, donnees: utilisateur };
  }

  private dechiffreDonneesUtilisateur(
    utilisateur: UtilisateurBDD
  ): Utilisateur {
    const { email, donnees } = utilisateur;
    return { ...donnees, email };
  }

  async ajoute(utilisateur: Utilisateur) {
    await this.knex('utilisateurs').insert(
      this.chiffreDonneesUtilisateur(utilisateur)
    );
  }

  async parEmail(email: string) {
    const utilisateur = await this.knex('utilisateurs')
      .where({ email })
      .first();
    if (!utilisateur) return undefined;
    return this.dechiffreDonneesUtilisateur(utilisateur);
  }
}
