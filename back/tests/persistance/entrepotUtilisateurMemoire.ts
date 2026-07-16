import { randomUUID } from 'node:crypto';
import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur.js';
import { Utilisateur } from '../../src/metier/utilisateur.js';
import { EntrepotMemoire } from './entrepotMemoire.js';

export class EntrepotUtilisateurMemoire extends EntrepotMemoire<Utilisateur> implements EntrepotUtilisateur {
  utilisateurs: Map<string, Utilisateur> = new Map<string, Utilisateur>();
  _echoueSurRechercheParMail = false;
  dernierUtilisateurMisAJour?: Utilisateur;

  ajoute = async (utilisateur: Utilisateur) => {
    utilisateur.idListeFavoris = randomUUID();
    await super.ajoute(utilisateur);
    this.utilisateurs.set(
      // Nous n'importons le fauxAdaptateurHachage de api/fauxObjets pour éviter un import cyclique
      `${utilisateur.email}-hache`,
      utilisateur
    );
  };

  echoueSurRechercheParMail = () => (this._echoueSurRechercheParMail = true);

  parEmailHache = async (emailHache: string) => {
    if (this._echoueSurRechercheParMail) {
      throw new Error('I’m sorry Dave, I’m afraid I can’t do that');
    }
    return this.utilisateurs.get(emailHache);
  };

  parIdListeFavoris = async (idListeFavoris: string) => {
    return this.entites.find((utilisateur) => utilisateur.idListeFavoris === idListeFavoris);
  };

  existe = async (emailHache: string) => !!(await this.parEmailHache(emailHache));

  metsAJour = async (utilisateur: Utilisateur) => {
    this.dernierUtilisateurMisAJour = utilisateur;
  };
}
