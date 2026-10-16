import { Outil } from '../../metier/outils/outils.js';

export type Retour = 'POSITIF' | 'NEGATIF';

export class RetourOutilDonné {
  outil: Outil;
  commentaire?: string;
  retour: Retour;

  constructor({ outil, commentaire, retour }: { outil: Outil; commentaire?: string; retour: Retour }) {
    this.outil = outil;
    this.retour = retour;
    this.commentaire = commentaire;
  }
}
