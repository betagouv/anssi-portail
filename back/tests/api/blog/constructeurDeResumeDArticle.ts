import { RésuméArticle } from '../../../src/metier/blog/resumeArticle.js';

export class ConstructeurDeRésuméDArticle {
  private slug: string = 'slug';
  private titre: string = 'Titre';

  avecLeSlug(slug: string) {
    this.slug = slug;
    return this;
  }

  avecLeTitre(titre: string) {
    this.titre = titre;
    return this;
  }

  construis(): RésuméArticle {
    return {
      slug: this.slug,
      titre: this.titre,
    };
  }
}
