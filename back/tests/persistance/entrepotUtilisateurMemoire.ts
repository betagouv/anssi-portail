import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { ClasseUtilisateur, Utilisateur } from '../../src/metier/utilisateur';
import { randomUUID } from 'node:crypto';

export class EntrepotUtilisateurMemoire implements EntrepotUtilisateur {
  entites: Utilisateur[] = [];

  tous = async () => [...this.entites];

  ajoute = async (utilisateur: ClasseUtilisateur) => {
    const {
      nom,
      prenom,
      email,
      telephone,
      domainesSpecialite,
      cguAcceptees,
      infolettreAcceptee,
    } = utilisateur;
    const utilisateurComplet = {
      nom,
      prenom,
      email,
      telephone,
      domainesSpecialite,
      cguAcceptees,
      infolettreAcceptee,
      idListeFavoris: randomUUID(),
      organisation: await utilisateur.organisation(),
    };
    this.entites.push(utilisateurComplet);
    //this.entites.push(utilisateur);
  };
  parEmail = async (email: string) => {
    return this.entites.find((utilisateur) => utilisateur.email === email);
  };
  parIdListeFavoris = async (idListeFavoris: string) => {
    return this.entites.find(
      (utilisateur) => utilisateur.idListeFavoris === idListeFavoris
    );
  };
  existe = async (email: string) => {
    return !!this.entites.find((utilisateur) => utilisateur.email === email);
  };
}
