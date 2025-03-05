import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { Utilisateur } from '../../src/metier/Utilisateur';

export class EntrepotUtilisateurMemoire implements EntrepotUtilisateur {
  entites: Utilisateur[] = [];
  ajoute = (utilisateur: Utilisateur) => {
    this.entites.push(utilisateur);
  };
  parEmail = (email: string) => {
    return this.entites.find((utilisateur) => utilisateur.email === email);
  };
}
