import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { Utilisateur, UtilisateurPartiel } from '../../src/metier/utilisateur';
import { randomUUID } from 'node:crypto';

export class EntrepotUtilisateurMemoire implements EntrepotUtilisateur {
  entites: Utilisateur[] = [];

  tous = async () => [...this.entites];

  ajoute = async (utilisateur: UtilisateurPartiel) => {
    const {
      nom,
      prenom,
      email,
      telephone,
      domainesSpecialite,
      cguAcceptees,
      infolettreAcceptee,
      siretEntite,
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
      organisation: { siret: siretEntite, departement: '75', nom: 'ANSSI' },
    };
    this.entites.push(utilisateurComplet);
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
