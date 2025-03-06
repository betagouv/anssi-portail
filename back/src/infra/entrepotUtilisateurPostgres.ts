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
    return utilisateur;
  }

  private dechiffreDonneesUtilisateur(
    utilisateur: UtilisateurBDD
  ): Utilisateur {
    return utilisateur;
  }

  async ajoute(utilisateur: Utilisateur) {
    await this.knex('utilisateurs').insert(
      this.chiffreDonneesUtilisateur(utilisateur)
    );
  }

  async parEmail(email: string) {
    return this.dechiffreDonneesUtilisateur(
      await this.knex('utilisateurs').where({ email }).first()
    );
  }
}
