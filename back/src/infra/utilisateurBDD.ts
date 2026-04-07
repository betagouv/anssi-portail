import Knex from 'knex';
import { ObjetChiffre } from './adaptateurChiffrement';

export interface UtilisateurBDD {
  email_hache: string;
  donnees: ObjetChiffre;
  id_liste_favoris: string | undefined;
  roles: Knex.Knex.Raw;
}
