import { Utilisateur } from '../../metier/utilisateur.js';

export class ProprieteTestRevendiquee {
  idResultatTest!: string;
  utilisateur!: Utilisateur;

  constructor({ idResultatTest, utilisateur }: { idResultatTest: string; utilisateur: Utilisateur }) {
    this.idResultatTest = idResultatTest;
    this.utilisateur = utilisateur;
  }
}
