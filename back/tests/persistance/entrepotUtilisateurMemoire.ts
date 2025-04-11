import { EntrepotUtilisateur } from '../../src/metier/entrepotUtilisateur';
import { Utilisateur } from '../../src/metier/utilisateur';
import { randomUUID } from 'node:crypto';
import { EntrepotMemoire } from './entrepotMemoire';

export class EntrepotUtilisateurMemoire
  extends EntrepotMemoire<Utilisateur>
  implements EntrepotUtilisateur
{
  ajoute = async (utilisateur: Utilisateur) => {
    utilisateur.idListeFavoris = randomUUID();
    await super.ajoute(utilisateur);
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
