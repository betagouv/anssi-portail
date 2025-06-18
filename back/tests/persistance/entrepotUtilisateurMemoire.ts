import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { Utilisateur } from '../../src/metier/utilisateur';
import { randomUUID } from 'node:crypto';
import { EntrepotMemoire } from './entrepotMemoire';
import { fauxAdaptateurHachage } from '../api/fauxObjets';

export class EntrepotUtilisateurMemoire
  extends EntrepotMemoire<Utilisateur>
  implements EntrepotUtilisateur
{
  utilisateurs: Map<string, Utilisateur> = new Map<string, Utilisateur>();
  _echoueSurRechercheParMail = false;

  ajoute = async (utilisateur: Utilisateur) => {
    utilisateur.idListeFavoris = randomUUID();
    await super.ajoute(utilisateur);
    this.utilisateurs.set(
      fauxAdaptateurHachage.hache(utilisateur.email),
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
    return this.entites.find(
      (utilisateur) => utilisateur.idListeFavoris === idListeFavoris
    );
  };

  existe = async (emailHache: string) =>
    !!(await this.parEmailHache(emailHache));
}
