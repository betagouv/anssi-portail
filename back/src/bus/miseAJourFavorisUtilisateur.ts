import { Utilisateur } from '../metier/utilisateur.js';

export class MiseAJourFavorisUtilisateur {
  utilisateur!: Utilisateur;

  constructor({ utilisateur }: { utilisateur: Utilisateur }) {
    this.utilisateur = utilisateur;
  }
}
