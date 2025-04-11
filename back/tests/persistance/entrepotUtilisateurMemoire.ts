import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { ClasseUtilisateur } from '../../src/metier/utilisateur';
import { randomUUID } from 'node:crypto';

export class EntrepotUtilisateurMemoire implements EntrepotUtilisateur {
  utilisateurs: ClasseUtilisateur[] = [];

  tous = async () => [...this.utilisateurs];

  ajoute = async (utilisateur: ClasseUtilisateur) => {
    utilisateur.idListeFavoris = randomUUID();
    this.utilisateurs.push(utilisateur);
  };
  parEmail = async (email: string) => {
    return this.utilisateurs.find((utilisateur) => utilisateur.email === email);
  };
  parIdListeFavoris = async (idListeFavoris: string) => {
    return this.utilisateurs.find(
      (utilisateur) => utilisateur.idListeFavoris === idListeFavoris
    );
  };
  existe = async (email: string) => {
    return !!this.utilisateurs.find(
      (utilisateur) => utilisateur.email === email
    );
  };
}
