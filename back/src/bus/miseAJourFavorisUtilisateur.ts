import { Utilisateur } from '../metier/utilisateur';

export class MiseAJourFavorisUtilisateur {
  utilisateur!: Utilisateur;

  constructor({ utilisateur }: { utilisateur: Utilisateur }) {
    this.utilisateur = utilisateur;
  }
}
