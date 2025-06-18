import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { Utilisateur } from '../../src/metier/utilisateur';
import { randomUUID } from 'node:crypto';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotUtilisateurMemoire
  extends EntrepotMemoire<Utilisateur>
  implements EntrepotUtilisateur
{
  _echoueSurRechercheParMail = false;

  ajoute = async (utilisateur: Utilisateur) => {
    utilisateur.idListeFavoris = randomUUID();
    await super.ajoute(utilisateur);
  };

  echoueSurRechercheParMail = () => (this._echoueSurRechercheParMail = true);

  parEmail = async (email: string): Promise<Utilisateur | undefined> => {
    if (this._echoueSurRechercheParMail) {
      throw new Error('I’m sorry Dave, I’m afraid I can’t do that');
    }
    return this.entites.find((utilisateur) => utilisateur.email === email);
  };
  parEmailHache = async (_emailHache: string) => {
    throw new Error('pas utilisable pour le moment');
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
