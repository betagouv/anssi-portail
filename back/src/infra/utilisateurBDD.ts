import { Role } from '../metier/utilisateur';
import { ObjetChiffre } from './adaptateurChiffrement';

export interface UtilisateurBDD {
  email_hache: string;
  donnees: ObjetChiffre;
  id_liste_favoris: string | undefined;
  roles: Role[];
}
