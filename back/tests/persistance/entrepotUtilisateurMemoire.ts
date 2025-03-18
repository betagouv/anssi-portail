import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { Utilisateur } from '../../src/metier/utilisateur';

export class EntrepotUtilisateurMemoire implements EntrepotUtilisateur {
  entites: Utilisateur[] = [];
  ajoute = async (utilisateur: Utilisateur) => {
    this.entites.push(utilisateur);
  };
  parEmail = async (email: string) => {
    return this.entites.find((utilisateur) => utilisateur.email === email);
  };
  existe = async (email: string) => {
    return !!this.entites.find((utilisateur) => utilisateur.email === email);
  };
}
