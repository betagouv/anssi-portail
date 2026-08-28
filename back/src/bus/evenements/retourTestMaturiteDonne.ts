type Retour = 'POSITIF' | 'NEGATIF';

export class RetourTestMaturitéDonné {
  commentaire?: string;
  retour: Retour;

  constructor({ commentaire, retour }: { commentaire?: string; retour: Retour }) {
    this.retour = retour;
    this.commentaire = commentaire;
  }
}
