export type Retour = 'POSITIF' | 'NEGATIF';

export class RetourArticleDonné {
  slug: string;
  commentaire?: string;
  retour: Retour;

  constructor({ slug, commentaire, retour }: { slug: string; commentaire?: string; retour: Retour }) {
    this.slug = slug;
    this.retour = retour;
    this.commentaire = commentaire;
  }
}
