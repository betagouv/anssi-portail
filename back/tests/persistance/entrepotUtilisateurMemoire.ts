import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { Utilisateur, UtilisateurPartiel } from '../../src/metier/utilisateur';

export class EntrepotUtilisateurMemoire implements EntrepotUtilisateur {
  entites: Utilisateur[] = [];
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
      organisation: { siret: siretEntite, departement: '75', nom: 'ANSSI' },
    };
    this.entites.push(utilisateurComplet);
  };
  parEmail = async (email: string) => {
    return this.entites.find((utilisateur) => utilisateur.email === email);
  };
  existe = async (email: string) => {
    return !!this.entites.find((utilisateur) => utilisateur.email === email);
  };
}
